import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useAuthorizedUser } from '../../features/authentication/useAuthorizedUser';
import { useChannelForChat } from './Chat.hooks';
import {
  ChatWrapper,
  Input,
  Message,
  Messages,
  MessageText,
  Title,
  UserName,
  Avatar,
  TimeStamp,
  BotMessage,
} from './Chat.styles';
import EventContext from './EventContext';
import avatarPlaceholder from '../../../../static/images/avatar-placeholder.png';
import { format, parseISO } from 'date-fns';

export const CHAT_HIDING_BREAKPOINT = '490';
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
  const { messages, sendMessage } = useChannelForChat(
    channelOption,
    user,
    visible,
    messagesRef,
  );

  const [messageText, setMessageText] = useState('');
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
      <Title>Chat and updates</Title>
      <Messages ref={messagesRef}>
        {messages.map(({ id, user_id, text, inserted_at, is_bot }) => {
          const at =
            inserted_at === '...'
              ? inserted_at
              : format(parseISO(inserted_at + 'Z'), 'h:mm b (E, dd. LLL)');

          if (is_bot) {
            return (
              <BotMessage key={id}>
                <TimeStamp>
                {text} {at}
                </TimeStamp>
              </BotMessage>
            );
          }

          const user = participants[user_id] || exParticipants[user_id];
          const imageUrl = user.image
            ? `${user.image}=s40-c`
            : avatarPlaceholder;

          return (
            <Message key={id}>
              <Avatar src={imageUrl} width={40} height={40} />
              <UserName>
                {user.name}
                <TimeStamp>{at}</TimeStamp>
              </UserName>
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
