import React, { FC, useContext } from 'react';
import { format, parseISO } from 'date-fns';

import {
  Avatar,
  Message,
  MessageText,
  TimeStamp,
  UserName,
  MessageData,
} from './Chat.styles';
import EventContext from '../EventContext';
import Markdown from '../../../components/Markdown';
import avatarPlaceholder from '../../../../../static/images/avatar-placeholder.png';
import { singleMessageT } from './chatTypes';
import BotChatMessage from './BotChatMessage';

type singleMessagePropsT = {
  messageItem: singleMessageT;
};

const SingleMessage: FC<singleMessagePropsT> = ({ messageItem }) => {
  const {
    event: { participants, exParticipants },
  } = useContext(EventContext);
  const {
    id, text, inserted_at, user_id, is_bot,
  } = messageItem.message;
  const at = inserted_at === '...'
    ? inserted_at
    : format(parseISO(`${inserted_at}Z`), 'h:mm b');

  if (is_bot) {
    return <BotChatMessage id={id} text={text} at={at} />;
  }

  const user = participants[user_id] || exParticipants[user_id];
  const imageUrl = user.image ? `${user.image}=s40-c` : avatarPlaceholder;

  return (
    <Message key={id}>
      <Avatar src={imageUrl} width={40} height={40} />
      <MessageData>
        <UserName>
          {user.name}
          <TimeStamp>{at}</TimeStamp>
        </UserName>
        <MessageText>
          <Markdown>{text}</Markdown>
        </MessageText>
      </MessageData>
    </Message>
  );
};

export default SingleMessage;
