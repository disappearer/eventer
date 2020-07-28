import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import { ButtonsGrid, FormGrid, FormTitle } from './Form.styles';
import { openDiscussionT, specificObjectiveT } from './types';

const Error = styled.div`
  margin-top: 3px;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.milanoRed};
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    onConfirm(objective, closeModal, () => {
      setIsSubmitting(false);
      toast.error('Removing decision failed. Please try again.', {
        autoClose: false,
      });
    });
  };
  return (
    <FormGrid>
      <FormTitle>
        Open
        {objective}
        {' '}
        discussion
      </FormTitle>
      <p>
        This will
        {' '}
        {hasCorrespondingDecision ? (
          <>
            mark the existing
            {' '}
            {objective}
            {' '}
            decision as pending
            <br />
            {' '}
            and discard it&quot;s resolution.
          </>
        ) : (
          `create a new ${objective} decision.`
        )}
      </p>
      <p>
        Are you sure you want to open
        {objective}
        {' '}
        for discussion?
      </p>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick} isSubmitting={isSubmitting}>
          Yes
        </Button>
        <Button onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
      </ButtonsGrid>
    </FormGrid>
  );
};

export default OpenDiscussionConfirmation;
