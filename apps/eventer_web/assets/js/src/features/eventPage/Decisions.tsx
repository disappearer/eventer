import React from 'react';
import { stateDecisionsT } from './util';

type decisionsPropsT = {
  decisions: stateDecisionsT;
  onDecisionClick: (n: number) => void;
};
const Decisions: React.FC<decisionsPropsT> = ({
  decisions,
  onDecisionClick,
}) => {
  return (
    <div>
      <h2>Decisions</h2>
      {Object.entries(decisions).map(([id, data]) => {
        const { title, description, pending, objective } = data;
        return (
          <div key={id} className="decision row">
            <div className="decision-section">
              <h3
                className="decision-title"
                onClick={() => onDecisionClick(parseInt(id, 10))}
              >
                {title}
                {pending && ' (pending)'}
              </h3>
              <p>{description}</p>
            </div>
            <div className="decision-section">
              <p>Objective: {objective}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Decisions;
