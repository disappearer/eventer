import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { ButtonsGrid } from './Form.styles';
import { openDiscussionT, specificObjectiveT } from './types';

const Error = styled.div`
  margin-top: 3px;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.milanoRed};
`;

export type updateEventT = (data: {
  title: string;
  description: string;
}) => void;

type openDiscussionConfirmationPropsT = {
  objective: specificObjectiveT;
  hasCorrespondingDecision: boolean;
  onConfirm: openDiscussionT;
  closeModal: () => void;
};

const OpenDiscussionConfirmation: React.FC<openDiscussionConfirmationPropsT> = ({
  objective,
  hasCorrespondingDecision,
  onConfirm,
  closeModal,
}) => {
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    setError(false);
    onConfirm(objective, closeModal, () => {
      setIsSubmitting(false);
      setError(true);
    });
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
      {error && <Error>Request failed for some reason ¯\_(ツ)_/¯</Error>}
      <ButtonsGrid>
        <Button onClick={handleConfirmClick} isSubmitting={isSubmitting}>
          Yes
        </Button>
        <Button onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
      </ButtonsGrid>
    </div>
  );
};

export default OpenDiscussionConfirmation;
