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

export const Message = styled.div`
  padding: 5px 0;
`;

export const UserName = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  letter-spacing: 0.03rem;
  font-weight: 400;
`;

export const MessageText = styled.div`
  color: ${(props) => props.theme.colors.mineShaft};
  font-size: 1rem;
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