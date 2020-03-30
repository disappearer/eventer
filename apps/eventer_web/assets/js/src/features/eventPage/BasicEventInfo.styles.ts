import styled from 'styled-components';

const BREAKPOINT_1 = '380';
const BREAKPOINT_2 = '540';
const BREAKPOINT_3 = '670';

export const Grid = styled.div`
  flex: none;
  display: grid;
  grid-template-columns: minmax(1fr, 200px) minmax(max-content, auto) auto;
  // grid-template-rows: minmax(auto, 70px) auto;
  grid-template-areas:
    'info time participants'
    'info place participants'
    'info . participants';

  justify-content: space-between;

  grid-gap: 20px;

  @media (max-width: ${BREAKPOINT_2}px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'info participants'
      'time place';

    justify-content: stretch;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-template-columns: auto;
    grid-template-areas:
      'info'
      'time'
      'place'
      'participants';

    justify-content: stretch;
  }
`;

export const Info = styled.div`
  grid-area: info;
`;

export const EventTitleLine = styled.div`
  display: grid;
  grid-template-columns: auto minmax(60px, auto);
  grid-gap: 20px;
  // justify-items: start;
  justify-content: start;
  align-items: center;

  // margin-bottom: px;
`;

export const EventTitle = styled.h1`
  margin: 0;
`;

export const Description = styled.div``;

export const CreatedBy = styled.div`
  margin-top: 5px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.grey};
`;

export const TimePlace = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(40px, auto));
  grid-gap: 10px;
  justify-content: start;

  align-self: start;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-template-columns: repeat(2, minmax(40px, auto));
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-template-columns: repeat(3, minmax(40px, auto));
  }
`;

export const Time = styled(TimePlace)`
  grid-area: time;
  align-items: start;

  @media (max-width: ${BREAKPOINT_3}px) {
    align-items: center;
  }

  @media (max-width: ${BREAKPOINT_3}px) {
    align-items: start;
  }
`;

export const Place = styled(TimePlace)`
  grid-area: place;
  align-items: center;
`;

export const Label = styled.h4`
  margin: 0;
`;

export const TimeData = styled.div`
  margin-right: 10px;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: auto;
  }
`;

export const Span = styled.span`
  margin-right: 10px;

  @media (max-width: ${BREAKPOINT_3}px) {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  @media (max-width: ${BREAKPOINT_1}px) {
    grid-column: auto;
    grid-row: auto;
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
