import Markdown from 'markdown-to-jsx';
import React from 'react';
import Button from '../../../components/Button';
import { formatTime } from '../../../util/time';
import useParticipation from '../hooks/useParticipation';
import { stateDecisionsT } from '../types';
import {
  Decision,
  DecisionList,
  DecisionListTitle,
  DecisionListTitleLine,
  DecisionsWrapper,
  DecisionTitle,
  DecisionTitleLine,
  Description,
  Objective,
} from './Decisions.styles';

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
  const isCurrentUserParticipating = useParticipation();
  return (
    <DecisionsWrapper>
      <DecisionListTitleLine>
        <DecisionListTitle>Decisions</DecisionListTitle>
        {isCurrentUserParticipating && (
          <Button onClick={onAddDecisionClick}>Add</Button>
        )}
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
                {isCurrentUserParticipating && objective === 'general' && (
                  <Button
                    onClick={() => onRemoveDecisionClick(parseInt(id, 10))}
                  >
                    Remove
                  </Button>
                )}
              </DecisionTitleLine>
              <Description>
                {pending
                  ? description && <Markdown>{description}</Markdown>
                  : formattedResolution && (
                      <Markdown>{formattedResolution}</Markdown>
                    )}
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
