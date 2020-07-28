import React, { FC } from 'react';

import { BotMessage, TimeStamp } from './Chat.styles';

type botMessageT = {
  id: React.ReactText;
  text: string;
  at: string;
};

const BotChatMessage: FC<botMessageT> = ({ id, text, at }) => (
  <BotMessage key={id}>
    <TimeStamp>
      {text}
      {' '}
      {at}
    </TimeStamp>
  </BotMessage>
);

export default BotChatMessage;
