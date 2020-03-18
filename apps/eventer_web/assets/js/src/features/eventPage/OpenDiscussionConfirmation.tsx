import React from 'react';
import { specificObjectiveT } from './types';

export type updateEventT = (data: {
  title: string;
  description: string;
}) => void;

type openDiscussionConfirmationPropsT = {
  objective: specificObjectiveT;
  hasCorrespondingDecision: boolean;
  onConfirm: () => void;
  closeModal: () => void;
};

const OpenDiscussionConfirmation: React.FC<openDiscussionConfirmationPropsT> = ({
  objective,
  hasCorrespondingDecision,
  onConfirm,
  closeModal,
}) => {
  const handleConfirmClick = () => {
    onConfirm();
    closeModal();
  };
  return (
    <div>
      Are you sure you want to open {objective} for discussion? This will{' '}
      {hasCorrespondingDecision
        ? `mark the existing ${objective} decision as pending and discard it's resolution.`
        : `create a new ${objective} decision`}
      <button onClick={handleConfirmClick}>Yes</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default OpenDiscussionConfirmation;
