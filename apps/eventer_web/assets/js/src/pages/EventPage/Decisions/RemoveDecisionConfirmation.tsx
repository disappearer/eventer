import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import EventContext from '../EventContext';
import { ButtonsGrid, FormGrid, FormTitle } from '../Form.styles';
import { removeDecisionT } from '../types';

const RemovedDecision = styled.h4`
  display: inline;
  margin: 0;
`;

type removeDecisionConfirmationPropsT = {
  id: number;
  onConfirm: removeDecisionT;
  closeModal: () => void;
};

const RemoveDecisionConfirmation: React.FC<removeDecisionConfirmationPropsT> = ({
  id,
  onConfirm,
  closeModal,
}) => {
  const { event, previousEvent } = useContext(EventContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event.decisions[id]) {
    const { title } = previousEvent.decisions[id];
    return (
      <FormGrid>
        Decision
        <RemovedDecision>{title}</RemovedDecision>
        has been removed.
      </FormGrid>
    );
  }

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    onConfirm(id, closeModal, () => {
      setIsSubmitting(false);
      toast.error('Removing decision failed. Please try again.', {
        autoClose: false,
      });
    });
  };

  const { title } = event.decisions[id];
  return (
    <FormGrid>
      <FormTitle>Remove decision</FormTitle>
      <p>
        Are you sure you want to remove the decision "
        {title}
        "?
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

export default RemoveDecisionConfirmation;
