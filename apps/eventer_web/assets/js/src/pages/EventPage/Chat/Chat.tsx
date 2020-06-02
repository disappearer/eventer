import { format, parseISO } from 'date-fns';
import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useContext, useMemo, useRef, useState } from 'react';
import avatarPlaceholder from '../../../../../static/images/avatar-placeholder.png';
import { useAuthorizedUser } from '../../../features/authentication/useAuthorizedUser';
import EventContext from '../EventContext';
import { useChannelForChat } from './hooks';
import {
  Avatar,
  BotMessage,
  ChatWrapper,
  Input,
  Message,
  Messages,
  MessageText,
  TimeStamp,
  Title,
  UserName,
  Day,
} from './styles';

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
  const { groupedMessages, sendMessage } = useChannelForChat(
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
        {groupedMessages.map(({ day, messages }) => {
          return (
            <div key={day}>
              <Day>{day}</Day>
              <div>
                {messages.map((messageItem) => {
                  if (messageItem.isGroup) {
                    const {
                      userId,
                      startTime,
                      messages: singleMessages,
                    } = messageItem;
                    const user = participants[userId] || exParticipants[userId];
                    const imageUrl = user.image
                      ? `${user.image}=s40-c`
                      : avatarPlaceholder;

                    const at = format(startTime, 'h:mm b');

                    return (
                      <Message key={singleMessages[0].id}>
                        <Avatar src={imageUrl} width={40} height={40} />
                        <UserName>
                          {user.name}
                          <TimeStamp>{at}</TimeStamp>
                        </UserName>
                          {singleMessages.map(({ id, text }) => (
                            <MessageText key={id}>{text}</MessageText>
                          ))}
                      </Message>
                    );
                  } else {
                    const {
                      id,
                      text,
                      inserted_at,
                      user_id,
                      is_bot,
                    } = messageItem.message;
                    const at =
                      inserted_at === '...'
                        ? inserted_at
                        : format(
                            parseISO(inserted_at + 'Z'),
                            'h:mm b',
                          );

                    if (is_bot) {
                      return (
                        <BotMessage key={id}>
                          <TimeStamp>
                            {text} {at}
                          </TimeStamp>
                        </BotMessage>
                      );
                    }

                    const user =
                      participants[user_id] || exParticipants[user_id];
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
                  }
                })}
              </div>
            </div>
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
