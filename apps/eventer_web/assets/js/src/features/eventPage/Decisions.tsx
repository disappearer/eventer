import React from 'react';
import styled from 'styled-components';
import { stateDecisionsT } from './types';
import Button from '../../components/Button';
import { formatTime } from '../../util/time';

const DecisionsWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding-right: 20px;

  @media (max-width: 490px) {
    padding-right: 0;
  }
`;

const DecisionListTitleLine = styled.div`
  flex: none;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 20px;
  justify-content: start;
  justify-items: start;
  align-items: center;
  margin-bottom: 14px;
`;

const DecisionListTitle = styled.h3`
  display: inline-block;
  margin: 0;
`;

const DecisionTitleLine = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  justify-content: start;
  justify-items: start;
  align-items: center;
`;

const DecisionTitle = styled.h4`
  margin: 0;
  display: inline-block;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

const DecisionList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Decision = styled.div`
  margin-bottom: 19px;
`;

const Description = styled.div`
  margin-top: 5px;
`;

const Objective = styled.div`
  margin-top: 5px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkerGrey};
`;

type decisionsPropsT = {
  decisions: stateDecisionsT;
  onDecisionClick: (n: number) => void;
  onAddDecisionClick: () => void;
  onRemoveDecisionClick: (id: number) => void;
};
const Decisions: React.FC<decisionsPropsT> = ({
  decisions,
  onDecisionClick,
  onAddDecisionClick,
  onRemoveDecisionClick,
}) => {
  return (
    <DecisionsWrapper>
      <DecisionListTitleLine>
        <DecisionListTitle>Decisions</DecisionListTitle>
        <Button onClick={onAddDecisionClick}>Add decision</Button>
      </DecisionListTitleLine>
      <DecisionList>
        {Object.entries(decisions).map(([id, data]) => {
          const { title, description, pending, objective, resolution } = data;
          const formattedResolution =
            resolution && objective === 'time'
              ? formatTime(resolution)
              : resolution;
          return (
            <Decision key={id}>
              <DecisionTitleLine>
                <DecisionTitle
                  onClick={() => onDecisionClick(parseInt(id, 10))}
                >
                  {title}
                  {pending && ' (pending)'}
                </DecisionTitle>
                {objective === 'general' && (
                  <Button
                    onClick={() => onRemoveDecisionClick(parseInt(id, 10))}
                  >
                    Remove
                  </Button>
                )}
              </DecisionTitleLine>
              <Description>
                {pending ? description : formattedResolution}
              </Description>
              <Objective>Objective: {objective}</Objective>
            </Decision>
          );
        })}
      </DecisionList>
    </DecisionsWrapper>
  );
};

export default Decisions;
