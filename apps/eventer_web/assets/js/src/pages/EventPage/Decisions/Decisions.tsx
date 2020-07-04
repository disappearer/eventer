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
  PendingIcon,
  ResolvedIcon,
  RemoveDecisionButton,
  TimeIcon,
  LocationIcon,
} from './Decisions.styles';
import ReactTooltip from 'react-tooltip';
import { getOSAndBrowser } from '../../../util/deviceInfo';
import theme from '../../../common/theme';

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

  const sortedDecisions = useMemo(() => {
    return Object.values(decisions).sort((a, b) => {
      switch (true) {
        case a.pending && !b.pending:
          return -1;
        case !a.pending && b.pending:
          return 1;
        default:
          return 0;
      }
    });
  }, [decisions]);

  const isMobile = useMemo(() => {
    const { os } = getOSAndBrowser();
    return os === 'Android' || os === 'iOS';
  }, []);

  return (
    <DecisionsWrapper>
      <DecisionListTitleLine>
        <DecisionListTitle>Decisions</DecisionListTitle>
        {isCurrentUserParticipating && (
          <>
            <AddButton onClick={onAddDecisionClick} data-tip="Add a decision" />
          </>
        )}
      </DecisionListTitleLine>
      <DecisionList>
        {sortedDecisions.map(
          ({ id, title, description, pending, objective, resolution }) => {
            const formattedResolution =
              resolution && objective === 'time'
                ? formatTime(resolution)
                : resolution;
            return (
              <Decision key={id} onClick={() => onDecisionClick(id)}>
                {!isMobile && <ReactTooltip />}
                <DecisionTitleLine>
                  <DecisionTitle>
                    {pending ? (
                      <PendingIcon data-tip="Pending" />
                    ) : (
                      <ResolvedIcon data-tip="Resolved" />
                    )}
                    {title}
                    {objective === 'time' && (
                      <TimeIcon data-tip="Time decision" />
                    )}
                    {objective === 'place' && (
                      <LocationIcon data-tip="Place decision" />
                    )}
                  </DecisionTitle>
                  {isCurrentUserParticipating && objective === 'general' && (
                    <RemoveDecisionButton
                      onClick={handleRemoveClick(id)}
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
          },
        )}
      </DecisionList>
    </DecisionsWrapper>
  );
};

export default Decisions;
