import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useCallback, useEffect, useState } from 'react';
import { userDataT } from '../../features/authentication/userReducer';
import { useParams } from 'react-router-dom';
import { reduxStateT } from '../../common/store';
import { useSelector } from 'react-redux';

type messageT = {
  id: number | string;
  text: string;
  user_id: number;
  inserted_at: string;
  is_bot: boolean;
};

type sendMessageT = (text: string, timestamp: number) => void;

type useChannelForChatT = (
  channelOption: Option<Channel>,
  user: userDataT,
  visible: boolean,
  messagesRef: React.RefObject<HTMLDivElement>,
) => { messages: messageT[]; sendMessage: sendMessageT };
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
  const isJoined = useSelector<reduxStateT, boolean>(
    ({ event: { isJoined } }) => isJoined,
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
      messagesDiv.scrollTop = messagesDiv.scrollTop + 13;
    }
  }, [messagesRef]);

  useEffect(() => {
    if (latestIdHash !== id_hash && !channelOption.isEmpty() && visible) {
      const channel = channelOption.get();
      channel
        .push('get_chat_messages', {})
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          setMessages(messages);
          setLatestIdHash(id_hash || 'undefined');
          setTimeout(scrollToBottom, 50);
        });

      channel.on('chat_shout', (message) => {
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
      });
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

  return { messages, sendMessage };
};
