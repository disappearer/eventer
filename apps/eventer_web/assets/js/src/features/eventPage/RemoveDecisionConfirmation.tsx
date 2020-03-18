import React from 'react';
import { removeDecisionT } from './types';

type removeDecisionConfirmationPropsT = {
  id: number;
  title: string;
  onConfirm: removeDecisionT;
  closeModal: () => void;
};

const RemoveDecisionConfirmation: React.FC<removeDecisionConfirmationPropsT> = ({
  id,
  title,
  onConfirm,
  closeModal
}) => {
  const handleConfirmClick = () => {
    onConfirm(id);
    closeModal();
  }
  return (
    <div>
      Are you sure you want to remove this decision:
      <h3>{title}</h3>
      <button onClick={handleConfirmClick}>Yes</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default RemoveDecisionConfirmation;
