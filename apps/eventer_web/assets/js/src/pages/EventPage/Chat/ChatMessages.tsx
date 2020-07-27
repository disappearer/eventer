import React, { FC } from 'react';
import MessageGroup from './MessageGroup';
import SingleMessage from './SingleMessage';
import { Messages, Day } from './Chat.styles';
import { dayMessagesT } from './Chat.util';

type chatMessagesT = {
  messagesRef: React.RefObject<HTMLDivElement>;
  groupedMessages: dayMessagesT[];
};

const ChatMessages: FC<chatMessagesT> = ({ messagesRef, groupedMessages }) => (
  <Messages ref={messagesRef}>
    {groupedMessages.map(({ day, messages }) => {
      return (
        <div key={day}>
          <Day>{day}</Day>
          <div>
            {messages.map(messageItem =>
              messageItem.isGroup ? (
                <MessageGroup messageItem={messageItem} />
              ) : (
                <SingleMessage messageItem={messageItem} />
              ),
            )}
          </div>
        </div>
      );
    })}
  </Messages>
);

export default ChatMessages;
