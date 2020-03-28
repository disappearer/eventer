import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { specificObjectiveT } from './types';

const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 70px);
  justify-content: center;
  grid-gap: 30px;
`;

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
      <p>Are you sure you want to open {objective} for discussion?</p>
      <p>
        This will{' '}
        {hasCorrespondingDecision
          ? `mark the existing ${objective} decision as pending and discard it's resolution.`
          : `create a new ${objective} decision.`}
      </p>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick}>Yes</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </ButtonsGrid>
    </div>
  );
};

export default OpenDiscussionConfirmation;
