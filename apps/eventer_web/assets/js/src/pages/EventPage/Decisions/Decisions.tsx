import React, { useCallback, useMemo } from 'react';
import Markdown from '../../../components/Markdown';
import { formatTime } from '../../../util/time';
import useParticipation from '../hooks/useParticipation';
import { stateDecisionsT } from '../types';
import {
  AddButton,
  Decision,
  DecisionList,
  DecisionListTitle,
  DecisionListTitleLine,
  DecisionsWrapper,
  DecisionTitle,
  DecisionTitleLine,
  Description,
  RemoveButton,
  PendingIcon,
  ResolvedIcon,
} from './Decisions.styles';
import ReactTooltip from 'react-tooltip';
import { getOSAndBrowser } from '../../../util/deviceInfo';

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

  const handleRemoveClick = useCallback(
    (id: number) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.stopPropagation();
      onRemoveDecisionClick(id);
    },
    [],
  );

  const isMobile = useMemo(() => {
    const { os } = getOSAndBrowser();
    return os === 'Android' || os === 'iOS';
  }, []);

  return (
    <DecisionsWrapper>
      {!isMobile && <ReactTooltip />}
      <DecisionListTitleLine>
        <DecisionListTitle>Decisions</DecisionListTitle>
        {isCurrentUserParticipating && (
          <>
            <AddButton onClick={onAddDecisionClick} data-tip="Add a decision" />
          </>
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
            <Decision
              key={id}
              onClick={() => onDecisionClick(parseInt(id, 10))}
            >
              <DecisionTitleLine>
                <DecisionTitle>
                  {pending ? (
                    <PendingIcon data-tip="Pending" />
                  ) : (
                    <ResolvedIcon data-tip="Resolved" />
                  )}
                  {title}
                </DecisionTitle>
                {isCurrentUserParticipating && objective === 'general' && (
                  <RemoveButton
                    onClick={handleRemoveClick(parseInt(id, 10))}
                    fontSize="small"
                    data-tip="Remove decision"
                  />
                )}
              </DecisionTitleLine>
              <Description>
                {pending
                  ? description && <Markdown>{description}</Markdown>
                  : formattedResolution && (
                      <Markdown>{formattedResolution}</Markdown>
                    )}
              </Description>
            </Decision>
          );
        })}
      </DecisionList>
    </DecisionsWrapper>
  );
};

export default Decisions;
