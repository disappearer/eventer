import React from 'react';
import Button from '../../components/Button';
import { ButtonsGrid, FormTitle, FormGrid } from './Form.styles';
import { discardResolutionT } from './types';

type discardResolutionConfirmationPropsT = {
  id: number;
  resolution: string | null;
  onConfirm: discardResolutionT;
  onSuccess: () => void;
};

const DiscardResolutionConfirmation: React.FC<discardResolutionConfirmationPropsT> = ({
  id,
  resolution,
  onConfirm,
  onSuccess,
}) => {
  const handleConfirmClick = () => {
    onConfirm(id);
    onSuccess();
  };
  return (
    <div>
      <FormTitle>Discard resolution</FormTitle>
      <p>
        Are you sure you want to discard resolution "{resolution}"?
      </p>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick}>Yes</Button>
        <Button onClick={onSuccess}>Cancel</Button>
      </ButtonsGrid>
    </div>
  );
};

export default DiscardResolutionConfirmation;
