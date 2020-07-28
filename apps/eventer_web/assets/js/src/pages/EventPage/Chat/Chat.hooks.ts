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
import { userDataT } from '../../../features/authentication/userTypes';
import { groupChatMessages } from './Chat.util';
import { dayMessagesT } from './chatTypes';

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
  isChatVisible: boolean,
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
  isChatVisible,
  messagesRef,
) => {
  const { id_hash } = useParams();
  const [previousEventIdHash, setPreviousEventIdHash] = useState('');
  const [previousIsChannelJoined, setPreviousIsChannelJoined] = useState(true);
  const [chatMessages, setMessages] = useState<messageT[]>([]);
  const [typists, setTypists] = useState<number[]>([]);
  const isChannelJoined = useSelector<reduxStateT, boolean>(
    ({ event: { isChannelJoined } }) => isChannelJoined,
  );

  const scrollToBottom = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight - messagesDiv.clientHeight;
    }
  }, [messagesRef]);

  const scrollABit = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop += 13;
    }
  }, [messagesRef]);

  const scroll = useCallback<scrollT>(
    scrollAmount => {
      const messagesDiv = messagesRef.current;
      if (messagesDiv) {
        const isAtBottom =
          messagesDiv.scrollTop ===
          messagesDiv.scrollHeight - messagesDiv.clientHeight;
        if (scrollAmount < 0 && isAtBottom) {
          return;
        }
        messagesDiv.scrollTop += scrollAmount;
      }
    },
    [messagesRef],
  );

  const handleIncomingMessage = useCallback(
    message => {
      if (message.user_id !== user.id || message.is_bot) {
        const messagesDiv = messagesRef.current;
        if (messagesDiv) {
          const shouldScrollToBottom =
            messagesDiv.scrollTop ===
            messagesDiv.scrollHeight - messagesDiv.clientHeight;
          setMessages(oldMessages => [...oldMessages, message]);
          if (shouldScrollToBottom) {
            setTimeout(scrollToBottom, 50);
          }
        }
      }
    },
    [messagesRef, scrollToBottom, user.id],
  );

  const timeoutRef = useRef<number>();

  const resetTimeoutRef = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  }, []);

  const handleOthersTyping = useCallback(({ user_id }: { user_id: number }) => {
    if (user_id !== user.id) {
      if (timeoutRef.current) {
        resetTimeoutRef();
      }
      setTypists(currentTypists => (currentTypists.includes(user_id)
        ? currentTypists
        : [...currentTypists, user_id]));
      timeoutRef.current = setTimeout(() => {
        setTypists(currentTypists => currentTypists.filter(id => id !== user_id));
      }, TYPING_THROTTLE_DELAY + 200);
    }
  }, [resetTimeoutRef, user.id]);

  const getChatMessages = useCallback(
    (channel: Channel) => {
      channel
        .push('get_chat_messages', {})
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          setMessages(messages);
          setPreviousEventIdHash(id_hash || 'undefined');
          setTimeout(scrollToBottom, 50);
        });
    },
    [id_hash, scrollToBottom],
  );

  const getMessagesSinceLastFocus = useCallback((channel: Channel) => {
    if (chatMessages.length) {
      const after = chatMessages[chatMessages.length - 1].inserted_at;
      channel
        .push('get_chat_messages_after', { after })
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          setMessages(currentMessages => [...currentMessages, ...messages]);
          setPreviousEventIdHash(id_hash || 'undefined');
          setTimeout(scrollABit, 50);
        })
        .receive('error', error => {
          console.log('error', error);
        });
    } else {
      getChatMessages(channel);
    }
  }, [getChatMessages, id_hash, chatMessages, scrollABit]);

  const setChannelHandlers = useCallback((channel: Channel) => {
    channel.on('chat_shout', handleIncomingMessage);
    channel.on('chat_is_typing', handleOthersTyping);
  }, [handleIncomingMessage, handleOthersTyping]);

  useEffect(() => {
    if (
      previousEventIdHash !== id_hash &&
      !channelOption.isEmpty() &&
      isChatVisible
    ) {
      const channel = channelOption.get();

      getChatMessages(channel);
      setChannelHandlers(channel);
    }
  },
  [
    channelOption,
    isChatVisible,
    id_hash, previousEventIdHash,
    getChatMessages,
    setChannelHandlers,
  ]);

  useEffect(() => {
    const isChannelRejoined = isChannelJoined && !previousIsChannelJoined;
    if (previousEventIdHash === id_hash && isChannelRejoined && isChatVisible) {
      const channel = channelOption.get();

      getMessagesSinceLastFocus(channel);
      setChannelHandlers(channel);
    }
    setPreviousIsChannelJoined(isChannelJoined);
  },
  [
    channelOption,
    isChatVisible,
    chatMessages,
    isChannelJoined,
    previousIsChannelJoined,
    previousEventIdHash,
    id_hash,
    getMessagesSinceLastFocus,
    setChannelHandlers,
  ]);

  const sendMessage = useCallback<sendMessageT>(
    (text, timestamp) => {
      const tempId = `temp:${timestamp}`;
      setMessages(currentMessages => [
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
          setMessages(currentMessages => currentMessages
            .map(currentMessage => (currentMessage.id === tempId ? message : currentMessage)));
        });
    },
    [channelOption, scrollToBottom, user.id],
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

  const groupedMessages = useMemo(() => groupChatMessages(chatMessages), [
    chatMessages,
  ]);

  return {
    groupedMessages,
    typists,
    sendMessage,
    scroll,
    handleTyping,
  };
};
