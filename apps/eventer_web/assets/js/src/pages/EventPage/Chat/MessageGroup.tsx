import React, { FC, useContext } from 'react';
import { format } from 'date-fns';

import {
  Avatar,
  Message,
  MessageText,
  TimeStamp,
  UserName,
  MessageData,
} from './Chat.styles';
import EventContext from '../EventContext';
import avatarPlaceholder from '../../../../../static/images/avatar-placeholder.png';
import { messageGroupT } from './Chat.util';

type messageGroupPropsT = {
  messageItem: messageGroupT;
};

const MessageGroup: FC<messageGroupPropsT> = ({ messageItem }) => {
  const {
    event: { participants, exParticipants },
  } = useContext(EventContext);

  const { userId, startTime, messages } = messageItem;
  const user = participants[userId] || exParticipants[userId];
  const imageUrl = user.image ? `${user.image}=s40-c` : avatarPlaceholder;

  const at = format(startTime, 'h:mm b');

  return (
    <Message key={messages[0].id}>
      <Avatar src={imageUrl} width={40} height={40} />
      <MessageData>
        <UserName>
          {user.name}
          <TimeStamp>{at}</TimeStamp>
        </UserName>
        {messages.map(({ id, text }) => (
          <MessageText key={id}>{text}</MessageText>
        ))}
      </MessageData>
    </Message>
  );
};

export default MessageGroup;
