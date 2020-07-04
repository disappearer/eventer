import styled from 'styled-components';
import Button from '../../components/Button';
import { Edit } from '@styled-icons/material';
import { CHAT_HIDING_BREAKPOINT } from './Chat/Chat.util';

export const BREAKPOINT_1 = '380';
export const BREAKPOINT_2 = '540';
export const BREAKPOINT_3 = '670';

export const BasicEventInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Info = styled.div`
  grid-area: info;
`;

export const EventTitleLine = styled.div``;

export const EventTitle = styled.h2`
  margin: 0;
`;

export const EditEventButton = styled(Edit)`
  margin-left: 7px;
  margin-bottom: 3px;
  width: 21px;
  height: 21px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }
`;

export const Description = styled.div``;

export const CreatedByAndParticipationButton = styled.div`
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    margin-top: 5px;
  }
`;
export const CreatedBy = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.emperor};
`;

export const ParticipationButton = styled(Button)<{ action: 'join' | 'leave' }>`
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-size: 0.75rem;

  ${({ theme, action }) =>
    action === 'leave'
      ? `
  color: ${theme.colors.grey};
  border: 1px solid ${theme.colors.grey};
  outline: 0;
  padding: 5px 9px;

  margin-right: 5px;

  &:hover {
    color: ${theme.colors.grey};
    background: transparent;
    border: 1px solid ${theme.colors.grey};
  }

  &:hover {
    box-shadow: 0 0 5px ${theme.colors.silver};
  }
  `
      : `
      padding: 5px 9px;
      box-sizing: border-box;
      color: ${theme.colors.roseOfSharon};
      background: transparent;
      font-weight: bold;
      border: 1px solid ${theme.colors.milanoRed};
      outline: 0;
      transition: box-shadow 0.2s ease-in-out;
      margin-right: 5px;

      &:hover {
        overflow: visible; 
        color: ${theme.colors.roseOfSharon};
        box-shadow: 0 0 5px ${theme.colors.milanoRedTransparenter};
        background: transparent;
      }
    `}
`;

export const TimePlace = styled.div`
  grid-area: timeplace;
  display: grid;
  grid-template-columns: repeat(3, minmax(40px, auto));
  grid-gap: 10px;
  justify-content: start;
  align-items: center;

  align-self: start;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-template-columns: repeat(2, minmax(40px, auto));
  }

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-template-columns: repeat(6, minmax(40px, auto));
    grid-gap: 20px;
    justify-content: stretch;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-template-columns: repeat(3, minmax(40px, auto));
    justify-content: start;
  }
`;

export const Label = styled.h5`
  margin: 0;
`;

export const PlaceLabel = styled(Label)`
  grid-row: 2/3;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-row: 3/4;
  }

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-column: 4/5;
    grid-row: auto;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: 2/3;
  }
`;

export const TimeData = styled.div`
  margin-right: 10px;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-column: 1/3;
    grid-row: 2/3;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: auto;
  }

  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 10px;

  @media (max-width: 850px) {
    grid-template-columns: none;
    column-gap: normal;
  }
`;

export const PlaceData = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    word-break: normal;
  }

  margin-right: 10px;
  grid-row: 2/3;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-column: 1/-1;
    grid-row: 4/5;
  }

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-column: 4/6;
    grid-row: 2/3;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: 2/3;
  }
`;

export const DiscussButton = styled(Button)`
  justify-self: end;
  letter-spacing: 0.05rem;
  margin-right: 5px;
  font-size: 0.7rem;

  @media (max-width: ${BREAKPOINT_2}px) {
    justify-self: start;
  }
`;

export const PlaceDiscussButton = styled(DiscussButton)`
  grid-row: 2/3;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-row: 3/4;
  }

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-column: 5/6;
    grid-row: auto;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: 2/3;
  }
`;

export const Participants = styled.div`
  grid-area: participants;
`;

export const ParticipantsGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 130px));
  grid-auto-flow: row dense;
  grid-gap: 10px;
  justify-items: start;

  font-size: 0.9rem;
  line-height: 1;
`;

export const Participant = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 5px;
  align-items: center;
`;

export const PresenceIndicator = styled.div<{ isOnline?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid ${({ isOnline, theme }) =>
    isOnline ? theme.colors.main : theme.colors.grey};
}
  background: ${({ isOnline, theme }) =>
    isOnline ? theme.colors.main : 'transparent'}
`;
