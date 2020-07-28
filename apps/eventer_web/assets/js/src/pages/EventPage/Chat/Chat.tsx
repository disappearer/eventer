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
import { useAuthorizedUser } from '../../../features/authentication/useAuthorizedUser';
import EventContext from '../EventContext';
import { useChannelForChat } from './Chat.hooks';
import { ChatWrapper, Title, TypingIndicator } from './Chat.styles';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

type chatPropsT = {
  visible: boolean;
  channel: Option<Channel>;
};

const Chat: React.FC<chatPropsT> = ({ visible, channel: channelOption }) => {
  const {
    event: { participants },
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

    const userNames = typists.map(userId => participants[userId].name);
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleTyping();
      e.preventDefault();
      setMessageText(e.target.value);
    },
    [handleTyping],
  );

  const submitForm = useCallback(() => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage.length > 0) {
      sendMessage(trimmedMessage, Date.now());
    }
    setMessageText('');
  }, [messageText, sendMessage]);

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.charCode === 13 && !e.shiftKey) {
        e.preventDefault();
        submitForm();
      }
    },
    [submitForm],
  );

  const inputRef = useRef<HTMLDivElement>(null);
  const previousInputHeightRef = useRef<number>(0);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const { height } = inputElement.getBoundingClientRect();
      previousInputHeightRef.current = height;
    }
  }, [previousInputHeightRef]);

  const handleResize = useCallback(
    () => {
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
    [scroll],
  );

  return (
    <ChatWrapper visible={visible}>
      <Title>Chat and updates</Title>
      <ChatMessages
        messagesRef={messagesRef}
        groupedMessages={groupedMessages}
      />
      {isParticipant && (
        <ChatInput
          inputRef={inputRef}
          messageText={messageText}
          handleInputChange={handleInputChange}
          handleEnterKeyPress={handleEnterKeyPress}
          handleResize={handleResize}
          submitForm={submitForm}
        />
      )}

      <TypingIndicator visible={whosTyping.length > 0}>
        {whosTyping}
      </TypingIndicator>
    </ChatWrapper>
  );
};

export default Chat;
