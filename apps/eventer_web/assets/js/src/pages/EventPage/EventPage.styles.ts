import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from './Chat/Chat';

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
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
  }
`;

export const DecisionsAndChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    min-height: auto;
  }

  @media (max-height: 530px) {
    min-height: auto;
    max-height: calc(100vh - 30px);
  }
`;

export const ChatWrapper = styled.div<visibilityPropsT>`
  flex: 1;
  display: none;
  flex-direction: row;
  min-height: 0;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${({ visible }) => {
      const display = visible ? 'flex' : 'none';
      return display;
    }};
  }

  @media (max-height: 530px) {
    min-height: auto;
    max-height: calc(100vh - 3px);
  }
`;

export const HorizontalSeparator = styled.div`
  flex: none;
  margin: 14px 0;
  height: 1px;
  background: linear-gradient(
    to left,
    transparent,
    ${(props) => props.theme.colors.bright},
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
    ${(props) => props.theme.colors.bright},
    transparent
  );

  @media (max-width: 490px) {
    display: none;
  }
`;
