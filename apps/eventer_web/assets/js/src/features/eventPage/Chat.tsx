import React from 'react';
import styled from 'styled-components';

const ChatWrapper = styled.div`
  flex: 2;
  padding-left: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 490px) {
    display: none;
  }
`;

const Title = styled.h3`
  margin: 0;
  margin-bottom: 14px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  color: ${props => props.theme.colors.darkerGrey};
  font-size: 0.9rem;
`;

const Chat: React.FC = () => {
  return (
    <ChatWrapper>
      <Title>Chat</Title>
      <div>Here. It will be.</div>
      <Messages>
        <div>User 1: asdf message is asdf</div>
        <div>User 2: asdf message is asdf</div>
        <div>User 1: asdf message is asdf</div>
        <div>...</div>
      </Messages>
    </ChatWrapper>
  );
};

export default Chat;
