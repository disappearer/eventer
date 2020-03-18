import React, { useState } from 'react';
import ResolveForm from './DecisionResolveForm';
import DecisionUpdateForm from './DecisionUpdateForm';
import {
  decisionT,
  discardResolutionT,
  resolveDecisionT,
  updateDecisionT,
} from './types';
import { useAuthorizedUser } from '../authentication/useAuthorizedUser';
import Poll from './Poll';

type decisionPropsT = {
  id: number;
  data: decisionT;
  onDecisionResolve: resolveDecisionT;
  onDecisionUpdate: updateDecisionT;
  onResolutionDiscard: discardResolutionT;
};

type decisionActionT = 'view' | 'edit' | 'resolve' | 'discard_resolution';

const Decision: React.FC<decisionPropsT> = ({
  id,
  data,
  onDecisionResolve,
  onDecisionUpdate,
  onResolutionDiscard,
}) => {
  const { id: currentUserId } = useAuthorizedUser();
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

  const { title, description, pending, objective, resolution, poll } = data;
  return (
    <div>
      <div className="row">
        {['view', 'resolve', 'discard_resolution'].includes(decisionAction) && (
          <div className="box">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        )}
        {decisionAction === 'edit' && (
          <DecisionUpdateForm
            id={id}
            initialValues={{ title, description }}
            onSubmit={onDecisionUpdate}
            onSuccess={resetDecisionModal}
          />
        )}
        <div className="box">
          <h3>Status</h3>
          <p>{pending ? 'pending' : 'resolved'}</p>
          <h3>Objective</h3>
          <p>{objective}</p>
          {resolution && (
            <>
              <h3>Resolution</h3>
              <p>{resolution}</p>
            </>
          )}
        </div>
        <div className="box">
          <h3>Poll</h3>
          {poll ? (
            <Poll poll={poll} hasVoted={false} />
          ) : (
            <button>Add poll</button>
          )}
        </div>
      </div>
      {decisionAction === 'view' && (
        <>
          <button onClick={showEditForm}>Edit</button>
          {pending ? (
            <button onClick={showResolveForm}>Resolve</button>
          ) : (
            objective === 'general' && (
              <button onClick={showDiscardConfirmation}>
                Discard resolution
              </button>
            )
          )}
        </>
      )}
      {decisionAction === 'resolve' && (
        <ResolveForm
          id={id}
          objective={objective}
          onSubmit={onDecisionResolve}
          onSuccess={resetDecisionModal}
        />
      )}
      {decisionAction === 'discard_resolution' && (
        <div>
          Are you sure you want to discard resolution "{resolution}"?
          <button onClick={discardResolution}>Yes</button>
          <button onClick={resetDecisionModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Decision;
