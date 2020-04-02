import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import EventContext from './EventContext';
import { ButtonsGrid } from './Form.styles';
import { removeDecisionT } from './types';

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

  if (!event.decisions[id]) {
    const { title } = previousEvent.decisions[id];
    return (
      <div>
        Decision <RemovedDecision>{title}</RemovedDecision> has been removed.
      </div>
    );
  }

  const handleConfirmClick = () => {
    onConfirm(id);
    closeModal();
  };

  const { title } = event.decisions[id];
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
