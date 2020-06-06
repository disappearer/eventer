import { Option } from 'funfix';
import throttle from 'lodash.throttle';
import { Channel } from 'phoenix';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { reduxStateT } from '../../../common/store';
import { userDataT } from '../../../features/authentication/userReducer';
import { dayMessagesT, groupChatMessages } from './Chat.util';

const TYPING_THROTTLE_DELAY = 2000;

export type messageT = {
  id: number | string;
  text: string;
  user_id: number;
  inserted_at: string;
  is_bot: boolean;
};

type sendMessageT = (text: string, timestamp: number) => void;
type scrollT = (amount: number) => void;
type handleTypingT = () => void;

type useChannelForChatT = (
  channelOption: Option<Channel>,
  user: userDataT,
  visible: boolean,
  messagesRef: React.RefObject<HTMLDivElement>,
) => {
  groupedMessages: dayMessagesT[];
  typists: number[];
  sendMessage: sendMessageT;
  scroll: scrollT;
  handleTyping: handleTypingT;
};
export const useChannelForChat: useChannelForChatT = (
  channelOption,
  user,
  visible,
  messagesRef,
) => {
  const { id_hash } = useParams();
  const [latestIdHash, setLatestIdHash] = useState('');
  const [previousIsJoined, setPreviousIsJoined] = useState(true);
  const [messages, setMessages] = useState<messageT[]>([]);
  const [typists, setTypists] = useState<number[]>([]);
  const isJoined = useSelector<reduxStateT, boolean>(
    ({ event: { isJoined } }) => isJoined,
  );

  const scrollToBottom = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight - messagesDiv.clientHeight;
    }
  }, [messagesRef.current]);

  const scrollABit = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollTop + 13;
    }
  }, [messagesRef.current]);

  const scroll = useCallback<scrollT>(
    (amount) => {
      const messagesDiv = messagesRef.current;
      if (messagesDiv) {
        const isAtBottom =
          messagesDiv.scrollTop ===
          messagesDiv.scrollHeight - messagesDiv.clientHeight;
        if (amount < 0 && isAtBottom) {
          return;
        }
        messagesDiv.scrollTop = messagesDiv.scrollTop + amount;
      }
    },
    [messagesRef.current],
  );

  const handleIncomingMessages = useCallback((message) => {
    if (message.user_id !== user.id || message.is_bot) {
      const messagesDiv = messagesRef.current;
      if (messagesDiv) {
        const shouldScrollToBottom =
          messagesDiv.scrollTop ===
          messagesDiv.scrollHeight - messagesDiv.clientHeight;
        setMessages((oldMessages) => [...oldMessages, message]);
        if (shouldScrollToBottom) {
          setTimeout(scrollToBottom, 50);
        }
      }
    }
  }, []);

  const timeoutRef = useRef<number>();

  const handleOthersTyping = useCallback(({ user_id }: { user_id: number }) => {
    if (user_id !== user.id) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      setTypists((currentTypists) =>
        currentTypists.includes(user_id)
          ? currentTypists
          : [...currentTypists, user_id],
      );
      timeoutRef.current = setTimeout(() => {
        setTypists((currentTypists) =>
          currentTypists.filter((id) => id !== user_id),
        );
      }, TYPING_THROTTLE_DELAY + 200);
    }
  }, []);

  useEffect(() => {
    if (latestIdHash !== id_hash && !channelOption.isEmpty() && visible) {
      const channel = channelOption.get();
      channel
        .push('get_chat_messages', {})
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          groupChatMessages(messages);
          setMessages(messages);
          setLatestIdHash(id_hash || 'undefined');
          setTimeout(scrollToBottom, 50);
        });

      channel.on('chat_shout', handleIncomingMessages);
      channel.on('chat_is_typing', handleOthersTyping);
    }
  }, [channelOption, visible, id_hash, latestIdHash]);

  useEffect(() => {
    const rejoined = isJoined && !previousIsJoined;
    if (latestIdHash === id_hash && rejoined && visible) {
      if (messages.length) {
        const after = messages[messages.length - 1].inserted_at;
        const channel = channelOption.get();
        channel
          .push('get_chat_messages_after', { after })
          .receive('ok', ({ messages }: { messages: messageT[] }) => {
            setMessages((currentMessages) => [...currentMessages, ...messages]);
            setLatestIdHash(id_hash || 'undefined');
            setTimeout(scrollABit, 50);
          })
          .receive('error', (error) => {
            console.log('error', error);
          });

        channel.on('chat_shout', handleIncomingMessages);
        channel.on('chat_is_typing', handleOthersTyping);
      } else {
        const channel = channelOption.get();
        channel
          .push('get_chat_messages', {})
          .receive('ok', ({ messages }: { messages: messageT[] }) => {
            setMessages(messages);
            setLatestIdHash(id_hash || 'undefined');
          });
      }
    }
    setPreviousIsJoined(isJoined);
  }, [
    channelOption,
    visible,
    messages,
    isJoined,
    previousIsJoined,
    latestIdHash,
    id_hash,
  ]);

  const sendMessage = useCallback<sendMessageT>(
    (text, timestamp) => {
      const tempId = `temp:${timestamp}`;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: tempId,
          user_id: user.id,
          text,
          inserted_at: '...',
          is_bot: false,
        },
      ]);
      setTimeout(scrollToBottom, 50);
      channelOption
        .get()
        .push('chat_shout', { text })
        .receive('ok', ({ message }: { message: messageT }) => {
          setMessages((currentMessages) =>
            currentMessages.map((currentMessage) =>
              currentMessage.id === tempId ? message : currentMessage,
            ),
          );
        });
    },
    [channelOption],
  );

  const handleTyping = useCallback<handleTypingT>(
    throttle(
      () => {
        channelOption.get().push('chat_is_typing', {});
      },
      TYPING_THROTTLE_DELAY,
      { trailing: false },
    ),
    [channelOption],
  );

  const groupedMessages = useMemo(() => groupChatMessages(messages), [
    messages,
  ]);

  return { groupedMessages, typists, sendMessage, scroll, handleTyping };
};
