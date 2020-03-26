import React from 'react';
import { stateDecisionsT } from './types';

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
    <div>
      <div className="row">
        <h3>Decisions</h3>
        <button onClick={onAddDecisionClick}>Add</button>
      </div>
      {Object.entries(decisions).map(([id, data]) => {
        const { title, description, pending, objective } = data;
        return (
          <div key={id} className="decision row">
            <div className="decision-section">
              <h4 className="decision-title">
                <a onClick={() => onDecisionClick(parseInt(id, 10))}>{title}</a>
                {pending && ' (pending)'}
              </h4>
              <p>{description}</p>
            </div>
            <div className="decision-section">
              <p>Objective: {objective}</p>
              {objective === 'general' && (
                <button onClick={() => onRemoveDecisionClick(parseInt(id, 10))}>
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Decisions;
