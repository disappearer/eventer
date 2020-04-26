import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { useAuthorizedUser } from '../../features/authentication/useAuthorizedUser';
import EventContext from './EventContext';

export const CHAT_HIDING_BREAKPOINT = '490';

type chatWrapperPropsT = {
  visible: boolean;
  isFullWidthChat: boolean;
};
const ChatWrapper = styled.div<chatWrapperPropsT>`
  flex: 2;
  display: ${({ isFullWidthChat, visible }) =>
    isFullWidthChat || visible ? 'flex' : 'none'};
  flex-direction: column;

  ${({ isFullWidthChat }) =>
    isFullWidthChat
      ? `
  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: none;
  }`
      : ''}
`;

const Title = styled.h3`
  margin: 0;
  margin-bottom: 14px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  font-size: 0.9rem;
`;

const Message = styled.div`
  padding: 5px 0;
`;

const UserName = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  letter-spacing: 0.03rem;
  font-weight: 400;
`;

const MessageText = styled.div`
  color: ${(props) => props.theme.colors.mineShaft};
  font-size: 1rem;
`;

const Input = styled.input`
  width: 90%;
  margin-bottom: 20px;
  line-height: 1;
  height: 24px;
  font-size: 0.9rem;
  font-weight: 300;
  padding: 0 7px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.colors.main};
`;

type messageT = {
  id: number | string;
  text: string;
  user_id: number;
  inserted_at: string;
};

type sendMessageT = (text: string, timestamp: number) => void;

type chatPropsT = {
  visible?: boolean;
  isFullWidthChat: boolean;
  channel: Option<Channel>;
};

const Chat: React.FC<chatPropsT> = ({
  visible = true,
  isFullWidthChat,
  channel: channelOption,
}) => {
  const {
    event: { participants, exParticipants },
  } = useContext(EventContext);
  const user = useAuthorizedUser();

  const isParticipant = useMemo(() => participants[user.id] !== undefined, [
    participants,
    user,
  ]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<messageT[]>([]);
  const [messageText, setMessageText] = useState('');
  const [alreadyRendered, setAlreadyRendered] = useState(false);

  const scrollToBottom = useCallback(() => {
    const messagesDiv = messagesRef.current;
    console.log('scrollToBottom -> messagesDiv');
    if (messagesDiv) {
      messagesDiv.scrollTop =
        messagesDiv.scrollHeight - messagesDiv.clientHeight;
    }
  }, [messagesRef]);

  // const messagesDiv = messagesRef.current;
  // if (messagesDiv) {
  //   console.log('messagesDiv.scrollTop', messagesDiv.scrollTop);
  // }
  // useEffect(() => {}, [messagesRef.current]);

  useEffect(() => {
    if (!alreadyRendered && !channelOption.isEmpty() && visible) {
      const channel = channelOption.get();
      channel
        .push('get_chat_messages', {})
        .receive('ok', ({ messages }: { messages: messageT[] }) => {
          setMessages(messages);
          setAlreadyRendered(true);
          console.log('setMessages');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessageText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageText.length > 0) {
      sendMessage(messageText, Date.now());
      setMessageText('');
    }
  };

  return (
    <ChatWrapper visible={visible} isFullWidthChat={isFullWidthChat}>
      <Title>Chat</Title>
      <Messages ref={messagesRef}>
        {messages.map(({ id, user_id, text }) => {
          const user = participants[user_id] || exParticipants[user_id];
          return (
            <Message key={id}>
              <UserName>{user.displayName}</UserName>
              <MessageText>{text}</MessageText>
            </Message>
          );
        })}
      </Messages>
      {isParticipant && (
        <form onSubmit={handleSubmit}>
          <Input type="text" onChange={handleChange} value={messageText} />
        </form>
      )}
    </ChatWrapper>
  );
};

export default Chat;
