import React, { useState } from 'react';
import ResolveForm, { resolveDecisionT } from './DecisionResolveForm';
import DecisionUpdateForm, { updateDecisionT } from './DecisionUpdateForm';
import { decisionT } from './stateTransformations';

export type updateEventT = (data: {
  title: string;
  description: string;
}) => void;

type decisionPropsT = {
  id: number;
  data: decisionT;
  onDecisionResolve: resolveDecisionT;
  onDecisionUpdate: updateDecisionT;
};

type decisionActionT = 'view' | 'edit' | 'resolve';

const Decision: React.FC<decisionPropsT> = ({
  id,
  data,
  onDecisionResolve,
  onDecisionUpdate,
}) => {
  const [decisionAction, setDecisionAction] = useState<decisionActionT>('view');

  const showEditForm = () => {
    setDecisionAction('edit');
  };

  const showResolveForm = () => {
    setDecisionAction('resolve');
  };

  const showDecisionData = () => {
    setDecisionAction('view');
  };

  const { title, description, pending, objective, resolution } = data;
  return (
    <div>
      <div className="row">
        {(decisionAction === 'view' || decisionAction === 'resolve') && (
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
            onSuccess={showDecisionData}
          />
        )}
        <div className="box">
          <h3>Status</h3>
          <p>{pending ? 'pending' : 'resolved'}</p>
          <h3>Objective</h3>
          <p>{objective}</p>
        </div>
      </div>
      {decisionAction === 'view' && (
        <>
          <button onClick={showEditForm}>Edit</button>
          {pending ? (
            <button onClick={showResolveForm}>Resolve</button>
          ) : (
            `Resolution: ${resolution}`
          )}
        </>
      )}
      {decisionAction === 'resolve' && (
        <>
          <ResolveForm
            id={id}
            objective={objective}
            onSubmit={onDecisionResolve}
            onSuccess={showDecisionData}
          />
        </>
      )}
    </div>
  );
};

export default Decision;
