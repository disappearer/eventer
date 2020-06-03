import React from 'react';
import Button from '../../components/Button';
import { ButtonsGrid, FormTitle } from './Form.styles';

type discardResolutionConfirmationPropsT = {
  title: string;
  question: string;
  onConfirm: () => void;
  onSuccess: () => void;
};

const Confirmation: React.FC<discardResolutionConfirmationPropsT> = ({
  title,
  question,
  onConfirm,
  onSuccess,
}) => {
  const handleConfirmClick = () => {
    onConfirm();
    onSuccess();
  };
  return (
    <div>
      <FormTitle>{title}</FormTitle>
      <p>{question}</p>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick}>Yes</Button>
        <Button onClick={onSuccess}>Cancel</Button>
      </ButtonsGrid>
    </div>
  );
};

export default Confirmation;
