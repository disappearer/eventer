import styled from 'styled-components';
import Button from '../../../../components/Button';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(63px, 103px)) auto;
  grid-template-areas:
    'info info poll'
    'objective status poll'
    'resolution resolution poll';

  grid-gap: 23px;
  justify-items: start;
  justify-content: start;
  align-items: start;

  @media (max-width: 440px) {
    grid-template-columns: repeat(2, minmax(63px, 123px));
    grid-template-areas:
      'info info'
      'objective status'
      'resolution resolution'
      'poll poll'
      'poll poll'
      'poll poll';
  }
`;

export const TitleLine = styled.div`
  display: grid;
  grid-template-columns: auto minmax(60px, auto);
  grid-gap: 20px;
  justify-content: start;
  align-items: center;

  margin-bottom: 5px;
`;

export const DecisionTitle = styled.h2`
  margin: 0;
`;

export const InfoArea = styled.div`
  grid-area: info;
`;

export const StatusArea = styled.div`
  grid-area: status;
`;

export const ObjectiveArea = styled.div`
  grid-area: objective;
`;

export const PollArea = styled.div`
  grid-area: poll;
  margin-left: 10px;

  @media (max-width: 440px) {
    margin: 0;
  }
`;

export const ResolutionArea = styled.div`
  grid-area: resolution;
`;

export const Label = styled.h4`
  margin: 0;
  margin-bottom: 5px;
`;

export const RemovePollButton = styled(Button)`
  margin-left: 10px;
`;

export const ResolutionLabel = styled.h4`
  margin: 0;
`;

export const RemovedDecision = styled.h4`
  display: inline;
  margin: 0;
`;
