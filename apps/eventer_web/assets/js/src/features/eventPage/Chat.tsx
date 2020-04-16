import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const CHAT_HIDING_BREAKPOINT = '490';

const ChatWrapper = styled.div<chatPropsT>`
  flex: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
  }
`;

const Title = styled.h3`
  margin: 0;
  margin-bottom: 14px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  color: ${(props) => props.theme.colors.darkerGrey};
  font-size: 0.9rem;
`;

type chatPropsT = {
  visible: boolean;
};

const Chat: React.FC<chatPropsT> = ({ visible }) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  const [alreadyRendered, setAlreadyRendered] = useState(false);

  useEffect(() => {
    if (!alreadyRendered && visible && messagesRef.current) {
      const messages = messagesRef.current;
      messages.scrollTop = messages.scrollHeight - messages.clientHeight;
      setAlreadyRendered(true);
    }
  }, [messagesRef, visible]);

  return (
    <ChatWrapper visible={visible}>
      <Title>Chat</Title>
      <Messages ref={messagesRef}>
        <div>User 1: first message</div>
        <div>User 2: asdf message is asdf</div>
        <div>
          User 1: asdf message is asdf but it's a longer one that hopefully
          spans multiple a rows
        </div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: last message</div>
        <div>...</div>
      </Messages>
    </ChatWrapper>
  );
};

export default Chat;
