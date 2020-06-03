import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from './Chat';

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
  &:hover {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      ${({theme}) => theme.colors.lightestGrey} 10%,
      rgba(0, 0, 0, 0) 90%
    );
  }
`;

export const BotMessage = styled.div`
  padding: 7px 0;
`;

export const Input = styled.input`
  width: 90%;
  margin-bottom: 20px;
  line-height: 1;
  height: 24px;
  font-size: 0.9rem;
  font-weight: 300;
  padding: 0 7px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.colors.main};
`;
