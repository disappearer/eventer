import styled from 'styled-components';
import Button from '../../components/Button';

export const BREAKPOINT_1 = '380';
export const BREAKPOINT_2 = '540';
export const BREAKPOINT_3 = '670';

export const Grid = styled.div`
  flex: none;
  display: grid;
  grid-template-columns: minmax(1fr, 200px) minmax(max-content, auto) auto;
  // grid-template-rows: minmax(auto, 70px) auto;
  grid-template-areas:
    'info timeplace participants'
    'info timeplace participants'
    'info timeplace participants';

  justify-content: space-between;

  grid-gap: 30px;

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'info participants'
      'timeplace timeplace';

    grid-gap: 20px;

    justify-content: stretch;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-template-columns: auto;
    grid-template-areas:
      'info'
      'timeplace'
      'timeplace'
      'participants';

    justify-content: stretch;
  }
`;

export const Info = styled.div`
  grid-area: info;
`;

export const EventTitleLine = styled.div``;

export const EventTitle = styled.h1`
  margin: 0;
`;

export const EditEventButton = styled(Button)`
  margin-top: 5px;
`;

export const Description = styled.div``;

export const CreatedBy = styled.div`
  margin-top: 5px;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.darkerGrey};
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

export const Label = styled.h4`
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
`;

export const PlaceData = styled.span`
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
