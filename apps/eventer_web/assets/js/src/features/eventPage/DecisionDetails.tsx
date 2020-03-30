import React, { useState } from 'react';
import { formatTime } from '../../util/time';
import ResolveForm from './DecisionResolveForm';
import DecisionUpdateForm from './DecisionUpdateForm';
import Poll from './Poll';
import PollForm from './PollForm';
import {
  addPollT,
  decisionT,
  discardResolutionT,
  resolveDecisionT,
  updateDecisionT,
} from './types';
import styled from 'styled-components';
import Button from '../../components/Button';
import DiscardResolutionConfirmation from './DiscardResolutionConfirmation';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(63px, 123px)) auto;
  grid-template-areas:
    'info info poll'
    'objective status poll'
    'resolution resolution poll';

  grid-gap: 23px;
  justify-items: start;
  justify-content: start;

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

const TitleLine = styled.div`
  display: grid;
  grid-template-columns: auto minmax(60px, auto);
  grid-gap: 20px;
  justify-content: start;
  align-items: center;

  margin-bottom: 5px;
`;

const DecisionTitle = styled.h2`
  margin: 0;
`;

const InfoArea = styled.div`
  grid-area: info;
`;

const StatusArea = styled.div`
  grid-area: status;
`;

const ObjectiveArea = styled.div`
  grid-area: objective;
`;

const PollArea = styled.div`
  grid-area: poll;
  margin-left: 10px;

  @media (max-width: 440px) {
    margin: 0;
  }
`;

const ResolutionArea = styled.div`
  grid-area: resolution;
`;

const Label = styled.h4`
  margin: 0;
  margin-bottom: 5px;
`;

const ResolutionLabel = styled.h4`
  margin: 0;
`;

type decisionActionT =
  | 'view'
  | 'edit'
  | 'resolve'
  | 'discard_resolution'
  | 'add_poll';

type decisionDetailsPropsT = {
  id: number;
  data: decisionT;
  onDecisionResolve: resolveDecisionT;
  onDecisionUpdate: updateDecisionT;
  onResolutionDiscard: discardResolutionT;
  onAddPoll: addPollT;
};

const DecisionDetails: React.FC<decisionDetailsPropsT> = ({
  id,
  data,
  onDecisionResolve,
  onDecisionUpdate,
  onResolutionDiscard,
  onAddPoll,
}) => {
  const [decisionAction, setDecisionAction] = useState<decisionActionT>('view');

  const showEditForm = () => {
    setDecisionAction('edit');
  };

  const showResolveForm = () => {
    setDecisionAction('resolve');
  };

  const resetDecisionModal = () => {
    setDecisionAction('view');
  };

  const showDiscardConfirmation = () => {
    setDecisionAction('discard_resolution');
  };

  const discardResolution = () => {
    onResolutionDiscard(id);
    resetDecisionModal();
  };

  const showAddPollForm = () => {
    setDecisionAction('add_poll');
  };

  const { title, description, pending, objective, resolution, poll } = data;
  return (
    <>
      {decisionAction === 'view' && (
        <Wrapper>
          <InfoArea>
            <TitleLine>
              <DecisionTitle>{title}</DecisionTitle>
              {decisionAction === 'view' && (
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
                {objective === 'general' && (
                  <Button onClick={showDiscardConfirmation}>
                    Discard resolution
                  </Button>
                )}
              </TitleLine>
              <div>
                {objective === 'time' ? formatTime(resolution) : resolution}
              </div>
            </ResolutionArea>
          )}
          <PollArea>
            <Label>Poll</Label>
            {poll ? (
              <Poll poll={poll} hasVoted={false} />
            ) : (
              <Button onClick={showAddPollForm}>Add poll</Button>
            )}
          </PollArea>
          {pending && <Button onClick={showResolveForm}>Resolve</Button>}
        </Wrapper>
      )}
      {decisionAction === 'edit' && (
        <DecisionUpdateForm
          id={id}
          initialValues={{ title, description }}
          onSubmit={onDecisionUpdate}
          onSuccess={resetDecisionModal}
          formTitle={`Update ${title}`}
        />
      )}
      {decisionAction === 'resolve' && (
        <ResolveForm
          formTitle={`Resolve ${title}`}
          id={id}
          objective={objective}
          onSubmit={onDecisionResolve}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'discard_resolution' && (
        <DiscardResolutionConfirmation
          id={id}
          resolution={resolution}
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
    </>
  );
};

export default DecisionDetails;
