import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from './Chat/Chat.util';

type visibilityPropsT = {
  visible: boolean;
};

export const EventPageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const LoaderWrapper = styled.div`
  padding-top: 100px;
`;
export const EventPanel = styled.div<visibilityPropsT>`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    flex: 1;
  }

  overflow: hidden;
`;

export const DecisionsAndChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 600px;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    flex-direction: column;
  }
`;
