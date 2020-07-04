import React, { useContext, useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import Button from '../../../../components/Button';
import Markdown from '../../../../components/Markdown';
import { formatTime } from '../../../../util/time';
import { EditEventButton } from '../../BasicEventInfo.styles';
import EventContext from '../../EventContext';
import useParticipation from '../../hooks/useParticipation';
import {
  addPollT,
  discardPollT,
  discardResolutionT,
  resolveDecisionT,
  updateDecisionT,
  voteT,
} from '../../types';
import AddPollForm from './AddPollForm';
import Confirmation from './Confirmation';
import { useDecisionActions } from './DecisionDetails.hooks';
import {
  ActionButtons,
  Data,
  DecisionTitle,
  InfoArea,
  InfoPiece,
  Label,
  OtherInfo,
  PollArea,
  PollLabel,
  PollSeparator,
  RemovedDecision,
  RemovePollButton,
  Resolution,
  ResolutionArea,
  ResolutionLabel,
  TitleLine,
  Wrapper,
} from './DecisionDetails.styles';
import ResolveForm from './DecisionResolveForm';
import DecisionUpdateForm from './DecisionUpdateForm';
import Poll from './Poll';

type decisionDetailsPropsT = {
  id: number;
  onDecisionResolve: resolveDecisionT;
  onDecisionUpdate: updateDecisionT;
  onResolutionDiscard: discardResolutionT;
  onPollDiscard: discardPollT;
  onAddPoll: addPollT;
  onVote: voteT;
};

const DecisionDetails: React.FC<decisionDetailsPropsT> = ({
  id,
  onDecisionResolve,
  onDecisionUpdate,
  onResolutionDiscard,
  onPollDiscard,
  onAddPoll,
  onVote,
}) => {
  const { event, previousEvent } = useContext(EventContext);
  const isCurrentUserParticipating = useParticipation();

  const decision = useMemo(
    () => event.decisions[id] || previousEvent.decisions[id],
    [event.decisions, previousEvent.decisions],
  );

  const {
    decisionAction,
    showEditForm,
    showDiscardResolutionConfirmation,
    showDiscardPollConfirmation,
    showAddPollForm,
    showResolveForm,
    resetDecisionModal,
    discardResolution,
    discardPoll,
  } = useDecisionActions(id, onResolutionDiscard, onPollDiscard);

  if (!event.decisions[id]) {
    return (
      <div>
        Decision <RemovedDecision>{decision.title}</RemovedDecision> has been
        removed.
      </div>
    );
  }

  const { title, description, pending, objective, resolution, poll } = decision;

  return (
    <>
      {decisionAction === 'view' && (
        <Wrapper>
          <ReactTooltip />
          <InfoArea>
            <TitleLine>
              <DecisionTitle>
                {title}
                {isCurrentUserParticipating && decisionAction === 'view' && (
                  <EditEventButton
                    onClick={showEditForm}
                    data-tip="Edit decision title/description"
                  >
                    Edit
                  </EditEventButton>
                )}
              </DecisionTitle>
            </TitleLine>
            {description && <div>{description}</div>}
            <OtherInfo>
              <InfoPiece>
                <Label>Status</Label>
                <Data>{pending ? 'pending' : 'resolved'}</Data>
              </InfoPiece>
              <InfoPiece>
                <Label>Objective</Label>
                <Data>{objective}</Data>
              </InfoPiece>
            </OtherInfo>
            <ResolutionArea>
              {pending ? (
                <ActionButtons>
                  <Button onClick={showResolveForm}>Resolve decision</Button>
                  {!poll && <Button onClick={showAddPollForm}>Add poll</Button>}
                </ActionButtons>
              ) : (
                <>
                  <TitleLine>
                    <ResolutionLabel>Resolution</ResolutionLabel>
                  </TitleLine>
                  {resolution && (
                    <Resolution>
                      {objective === 'time' ? (
                        formatTime(resolution)
                      ) : (
                        <Markdown>{resolution}</Markdown>
                      )}
                    </Resolution>
                  )}
                  {isCurrentUserParticipating && objective === 'general' && (
                    <ActionButtons>
                      <Button onClick={showDiscardResolutionConfirmation}>
                        Discard resolution
                      </Button>
                    </ActionButtons>
                  )}
                </>
              )}
            </ResolutionArea>
          </InfoArea>

          {isCurrentUserParticipating && poll && (
            <>
              <PollSeparator />
              <PollArea>
                <PollLabel>
                  Poll
                  {pending && (
                    <RemovePollButton
                      onClick={showDiscardPollConfirmation}
                      data-tip="Discard poll"
                    >
                      Remove poll
                    </RemovePollButton>
                  )}
                </PollLabel>
                <Poll
                  poll={poll}
                  onVote={onVote}
                  decisionId={id}
                  pending={pending}
                />
              </PollArea>
            </>
          )}
        </Wrapper>
      )}
      {decisionAction === 'edit' && (
        <DecisionUpdateForm
          id={id}
          initialValues={{ title, description: description || '' }}
          onSubmit={onDecisionUpdate}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'resolve' && (
        <ResolveForm
          formTitle={`Resolve "${title}" decision`}
          id={id}
          objective={objective}
          onSubmit={onDecisionResolve}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'discard_resolution' && (
        <Confirmation
          title="Discard resolution"
          question={`Are you sure you want to discard resolution "${resolution}"?`}
          failText="Resolution discarding failed. Please try again."
          onSubmit={discardResolution}
          goBack={resetDecisionModal}
        />
      )}
      {decisionAction === 'add_poll' && (
        <AddPollForm
          decisionId={id}
          onSubmit={onAddPoll}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'discard_poll' && (
        <Confirmation
          title="Remove poll"
          question={`Are you sure you want to remove the "${title}" decision poll?`}
          failText="Poll discarding failed. Please try again."
          onSubmit={discardPoll}
          goBack={resetDecisionModal}
        />
      )}
    </>
  );
};

export default DecisionDetails;
