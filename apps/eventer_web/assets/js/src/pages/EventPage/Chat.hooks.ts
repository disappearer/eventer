import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useCallback, useEffect, useState } from 'react';
import { userDataT } from '../../features/authentication/userReducer';
import { useParams } from 'react-router-dom';

type messageT = {
  id: number | string;
  text: string;
  user_id: number;
  inserted_at: string;
};

type sendMessageT = (text: string, timestamp: number) => void;

type useChannelForChatT = (
  channelOption: Option<Channel>,
  user: userDataT,
  visible: boolean,
  messagesRef: React.RefObject<HTMLDivElement>,
  eventTitle: string,
) => { messages: messageT[]; sendMessage: sendMessageT };
export const useChannelForChat: useChannelForChatT = (
  channelOption,
  user,
  visible,
  messagesRef,
  eventTitle,
) => {
  const { id_hash } = useParams();
  const [latestIdHash, setLatestIdHash] = useState('');
  const [messages, setMessages] = useState<messageT[]>([]);

  const scrollToBottom = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight - messagesDiv.clientHeight;
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
        if (message.user_id !== user.id) {
          if (Notification.permission === 'granted' && document.hidden) {
            const notification = new Notification(
              `"${eventTitle}" is active!`,
              {
                body: 'Someone wrote in the chat.',
                requireInteraction: true,
              },
            );
            notification.onclick = function () {
              window.focus();
            };
          }
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
  }, [channelOption, visible, id_hash, latestIdHash, setLatestIdHash]);

  const sendMessage = useCallback<sendMessageT>(
    (text, timestamp) => {
      const tempId = `temp:${timestamp}`;
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: tempId, user_id: user.id, text, inserted_at: '...' },
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
