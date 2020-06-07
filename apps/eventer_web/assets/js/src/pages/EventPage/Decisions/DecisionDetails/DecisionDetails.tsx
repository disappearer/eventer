import Markdown from 'markdown-to-jsx';
import React, { useContext } from 'react';
import Button from '../../../../components/Button';
import { formatTime } from '../../../../util/time';
import EventContext from '../../EventContext';
import useParticipation from '../../hooks/useParticipation';
import { addPollT, discardPollT, discardResolutionT, resolveDecisionT, updateDecisionT, voteT } from '../../types';
import { useDecisionActions } from './DecisionDetails.hooks';
import { DecisionTitle, InfoArea, Label, ObjectiveArea, PollArea, RemovedDecision, RemovePollButton, Resolution, ResolutionArea, ResolutionLabel, StatusArea, TitleLine, Wrapper } from './DecisionDetails.styles';
import ResolveForm from './DecisionResolveForm';
import DecisionUpdateForm from './DecisionUpdateForm';
import Confirmation from './DiscardResolutionConfirmation';
import Poll from './Poll';
import PollForm from './PollForm';

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

  const decision = event.decisions[id] || previousEvent.decisions[id];

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
          <InfoArea>
            <TitleLine>
              <DecisionTitle>{title}</DecisionTitle>
              {isCurrentUserParticipating && decisionAction === 'view' && (
                <Button onClick={showEditForm}>Edit</Button>
              )}
            </TitleLine>
            <div>{description}</div>
          </InfoArea>

          <StatusArea>
            <Label>Status</Label>
            <div>{pending ? 'pending' : 'resolved'}</div>
          </StatusArea>
          <ObjectiveArea>
            <Label>Objective</Label>
            <div>{objective}</div>
          </ObjectiveArea>
          {resolution && (
            <ResolutionArea>
              <TitleLine>
                <ResolutionLabel>Resolution</ResolutionLabel>
                {isCurrentUserParticipating && objective === 'general' && (
                  <Button onClick={showDiscardResolutionConfirmation}>
                    Discard resolution
                  </Button>
                )}
              </TitleLine>
              <Resolution>
                {objective === 'time' ? (
                  formatTime(resolution)
                ) : (
                  <Markdown>{resolution}</Markdown>
                )}
              </Resolution>
            </ResolutionArea>
          )}
          {isCurrentUserParticipating && (
            <>
              <PollArea>
                {poll ? (
                  <>
                    <Label>
                      Poll
                      <RemovePollButton onClick={showDiscardPollConfirmation}>
                        Remove poll
                      </RemovePollButton>
                    </Label>
                    <Poll
                      poll={poll}
                      onVote={onVote}
                      decisionId={id}
                      pending={pending}
                    />
                  </>
                ) : (
                  pending && (
                    <>
                      <Label>Poll</Label>
                      <Button onClick={showAddPollForm}>Add poll</Button>
                    </>
                  )
                )}
              </PollArea>
              {pending && <Button onClick={showResolveForm}>Resolve</Button>}
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
          formTitle={`Update "${title}"`}
        />
      )}
      {decisionAction === 'resolve' && (
        <ResolveForm
          formTitle={`Resolve "${title}"`}
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
          onConfirm={discardResolution}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'add_poll' && (
        <PollForm
          decisionId={id}
          onSubmit={onAddPoll}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'discard_poll' && (
        <Confirmation
          title="Remove poll"
          question={`Are you sure you want to remove the "${title}" decision poll?`}
          onConfirm={discardPoll}
          onSuccess={resetDecisionModal}
        />
      )}
    </>
  );
};

export default DecisionDetails;
