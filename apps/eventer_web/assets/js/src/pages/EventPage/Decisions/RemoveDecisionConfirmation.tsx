import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button';
import EventContext from '../EventContext';
import { ButtonsGrid } from '../Form.styles';
import { removeDecisionT } from '../types';

const RemovedDecision = styled.h4`
  display: inline;
  margin: 0;
`;

const Error = styled.div`
  margin-top: 3px;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.milanoRed};
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

  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event.decisions[id]) {
    const { title } = previousEvent.decisions[id];
    return (
      <div>
        Decision <RemovedDecision>{title}</RemovedDecision> has been removed.
      </div>
    );
  }

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    setError(false);
    onConfirm(id, closeModal, () => {
      setIsSubmitting(false);
      setError(true);
    });
  };

  const { title } = event.decisions[id];
  return (
    <div>
      Are you sure you want to remove this decision:
      <h3>{title}</h3>
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

export default RemoveDecisionConfirmation;
