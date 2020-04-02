import React, { useContext } from 'react';
import styled from 'styled-components';
import EventContext from './EventContext';
import { optionT, stateEventT } from './types';

const Options = styled.div`
  display: grid;
  grid-gap: 9px;
`;

const Option = styled.div``;

const Voters = styled.div`
  margin-top: 5px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.darkerGrey};
`;

type pollResultsT = {
  options: optionT[];
};
const PollResults: React.FC<pollResultsT> = ({ options }) => {
  const { event } = useContext(EventContext);

  return (
    <Options>
      {options.map(option => (
        <Option key={option.id}>
          <div>{option.text}</div>
          <Voters>{getVoters(option, event)}</Voters>
        </Option>
      ))}
    </Options>
  );
};

export default PollResults;

type getVotersT = (option: optionT, event: stateEventT) => string;
const getVoters: getVotersT = (option, event) => {
  if (option.votes.length === 0) {
    return 'Nobody voted';
  } else {
    const { participants, exParticipants } = event;
    const voters = option.votes.reduce((voters, voterId) => {
      const voter = participants[voterId] || exParticipants[voterId];
      return `${voters} ${voter.displayName},`;
    }, '');
    return voters.slice(0, -1);
  }
};
