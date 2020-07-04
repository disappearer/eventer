import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from '../pages/EventPage/Chat/Chat.util';

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

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: none;
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
