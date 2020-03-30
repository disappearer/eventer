import React from 'react';
import Button from '../../components/Button';
import { ButtonsGrid } from './Form.styles';
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
  closeModal,
}) => {
  const handleConfirmClick = () => {
    onConfirm(id);
    closeModal();
  };
  return (
    <div>
      Are you sure you want to remove this decision:
      <h3>{title}</h3>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick}>Yes</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </ButtonsGrid>
    </div>
  );
};

export default RemoveDecisionConfirmation;
