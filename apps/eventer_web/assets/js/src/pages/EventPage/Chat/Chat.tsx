import { format, parseISO } from 'date-fns';
import { Option } from 'funfix';
import { Channel } from 'phoenix';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import avatarPlaceholder from '../../../../../static/images/avatar-placeholder.png';
import { useAuthorizedUser } from '../../../features/authentication/useAuthorizedUser';
import EventContext from '../EventContext';
import { useChannelForChat } from './Chat.hooks';
import {
  Avatar,
  BotMessage,
  ChatWrapper,
  Day,
  Input,
  Message,
  Messages,
  MessageText,
  TimeStamp,
  Title,
  TypingIndicator,
  UserName,
} from './Chat.styles';
import Markdown from '../../../components/Markdown';

type chatPropsT = {
  visible: boolean;
  channel: Option<Channel>;
};

const Chat: React.FC<chatPropsT> = ({ visible, channel: channelOption }) => {
  console.log('visible', visible);
  const {
    event: { participants, exParticipants },
  } = useContext(EventContext);
  const user = useAuthorizedUser();

  const isParticipant = useMemo(() => participants[user.id] !== undefined, [
    participants,
    user,
  ]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const {
    groupedMessages,
    typists,
    sendMessage,
    scroll,
    handleTyping,
  } = useChannelForChat(channelOption, user, visible, messagesRef);

  const whosTyping = useMemo(() => {
    if (typists.length === 0) {
      return '';
    }

    const userNames = typists.map((userId) => participants[userId].name);
    switch (userNames.length) {
      case 1:
        return `${userNames[0]} is typing...`;
      case 2:
        return `${userNames[0]} and ${userNames[1]} are typing...`;
      default:
        const allButLast = userNames.slice(0, -1);
        const last = userNames[userNames.length - 1];
        return `${allButLast.join(', ')} and ${last} are typing...`;
    }
  }, [participants, typists]);

  const [messageText, setMessageText] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTyping();
    e.preventDefault();
    const value = e.target.value;
    setMessageText(() => {
      return value;
    });
  };
  const submitForm = () => {
    if (messageText.length > 0) {
      sendMessage(messageText.trim(), Date.now());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.charCode == 13) {
      if (!e.shiftKey) {
        const trimmedInput = messageText.trim();
        // TODO: remove these hacky timeouts somehow
        if (trimmedInput.length > 0) {
          setTimeout(submitForm, 5);
        } else {
          setTimeout(() => {
            setMessageText(() => {
              console.log('onPress');
              return '';
            });
          }, 5);
        }
      }
    }
  };

  const inputRef = useRef<HTMLDivElement>(null);
  const previousInputHeightRef = useRef<number>(0);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const { height } = inputElement.getBoundingClientRect();
      previousInputHeightRef.current = height;
    }
  }, [inputRef.current, previousInputHeightRef]);

  const handleResize = useCallback(
    (e: Event) => {
      const inputElement = inputRef.current;
      if (inputElement) {
        const { height } = inputElement.getBoundingClientRect();
        const diff = height - previousInputHeightRef.current;
        if (diff !== 0) {
          scroll(diff);
        }
        previousInputHeightRef.current = height;
      }
    },
    [previousInputHeightRef, inputRef.current],
  );

  return (
    <ChatWrapper visible={visible}>
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
                          <MessageText key={id}>
                            <Markdown>{text}</Markdown>
                          </MessageText>
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
                        : format(parseISO(inserted_at + 'Z'), 'h:mm b');

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
                        <MessageText>
                          <Markdown>{text}</Markdown>
                        </MessageText>
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
        <div ref={inputRef}>
          <Input
            value={messageText}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
            onResize={handleResize}
            maxRows={4}
          />
        </div>
      )}

      <TypingIndicator visible={whosTyping.length > 0}>
        {whosTyping}
      </TypingIndicator>
    </ChatWrapper>
  );
};

export default Chat;
