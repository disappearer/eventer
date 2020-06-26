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

export const HorizontalSeparator = styled.div`
  flex: none;
  margin: 11px 0;
  height: 1px;
  background: linear-gradient(
    to left,
    transparent,
    ${({ theme }) => theme.colors.bright},
    transparent
  );
`;

export const VerticalSeparator = styled.div`
  width: 1px;
  margin: 0 20px;
  height: 90%;
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors.bright},
    transparent
  );

  @media (max-width: 490px) {
    display: none;
  }
`;
