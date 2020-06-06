import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from './Chat';
import TextArea from 'react-autosize-textarea';

type chatWrapperPropsT = {
  visible: boolean;
  isFullWidthChat: boolean;
};
export const ChatWrapper = styled.div<chatWrapperPropsT>`
  flex: 2;
  display: ${({ isFullWidthChat, visible }) =>
    isFullWidthChat || visible ? 'flex' : 'none'};
  flex-direction: column;

  ${({ isFullWidthChat }) =>
    isFullWidthChat
      ? `
  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: none;
  }`
      : ''}
`;

export const Title = styled.h3`
  margin: 0;
  margin-bottom: 14px;
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  font-size: 0.9rem;
`;

export const Day = styled.div`
  text-align: center;
  margin: 15px 0;
  color: ${(props) => props.theme.colors.lighterGrey};
  font-weight: 300;
  font-size: 0.8rem;
`;

export const Message = styled.div`
  display: grid;
  column-gap: 10px;
  grid-template-columns: auto 1fr;
  padding: 5px 0;
`;

export const Avatar = styled.img`
  grid-column: 1 / span 1;
  grid-row: 1 / span 2;
  border-radius: 50%;
`;

export const UserName = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  color: ${(props) => props.theme.colors.secondary};
  letter-spacing: 0.03rem;
  font-weight: 400;
`;

export const TimeStamp = styled.span`
  margin-left: 5px;
  color: ${(props) => props.theme.colors.lighterGrey};
  font-weight: 300;
  font-size: 0.8rem;
`;

export const MessageText = styled.div`
  grid-column: 2 / span 1;
  color: ${({ theme }) => theme.colors.mineShaft};
  font-size: 1rem;
  padding: 3px 0;
  white-space: pre-line;
  &:hover {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      ${({ theme }) => theme.colors.lightestGrey} 10%,
      rgba(0, 0, 0, 0) 90%
    );
  }
`;

export const BotMessage = styled.div`
  padding: 7px 0;
`;

export const Input = styled(TextArea)`
  width: 90%;
  line-height: 16px;
  font-size: 1rem;
  font-weight: 300;
  font-family: 'Helvetica', 'Arial', sans-serif;
  padding: 7px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.colors.main};

  resize: none;
`;

export const TypingIndicator = styled.div<{ visible: boolean }>`
  color: ${(props) => props.theme.colors.lighterGrey};
  font-weight: 300;
  font-size: 0.8rem;

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  height: 20px;
  width: 90%;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;