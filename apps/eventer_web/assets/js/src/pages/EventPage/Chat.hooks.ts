import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useCallback, useEffect, useState } from 'react';
import { userDataT } from '../../features/authentication/userReducer';

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
) => { messages: messageT[]; sendMessage: sendMessageT };
export const useChannelForChat: useChannelForChatT = (
  channelOption,
  user,
  visible,
  messagesRef,
) => {
  const [alreadyRendered, setAlreadyRendered] = useState(false);
  const [messages, setMessages] = useState<messageT[]>([]);

  const scrollToBottom = useCallback(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight - messagesDiv.clientHeight;
    }
  }, [messagesRef]);

  useEffect(() => {
    if (!alreadyRendered && !channelOption.isEmpty() && visible) {
      const channel = channelOption.get();
      channel
        .push('get_chat_messages', {})
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          setMessages(messages);
          setAlreadyRendered(true);
          setTimeout(scrollToBottom, 50);
        });

      channel.on('chat_shout', (message) => {
        if (message.user_id !== user.id) {
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
  }, [channelOption, visible]);

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
