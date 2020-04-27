import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useAuthorizedUser } from '../../features/authentication/useAuthorizedUser';
import { useChannelForChat } from './Chat.hooks';
import { ChatWrapper, Input, Message, Messages, MessageText, Title, UserName } from './Chat.styles';
import EventContext from './EventContext';

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
