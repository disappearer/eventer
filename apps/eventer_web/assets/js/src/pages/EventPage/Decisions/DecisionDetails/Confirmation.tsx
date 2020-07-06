import React, { useState } from 'react';
import Button from '../../../../components/Button';
import { ButtonsGrid, FormTitle, FormGrid } from '../../Form.styles';
import { toast } from 'react-toastify';

type propsT = {
  title: string;
  question: string | React.ReactNode;
  failText: string;
  onSubmit: (onSuccess: () => void, onError: () => void) => void;
  goBack: () => void;
};

const Confirmation: React.FC<propsT> = ({
  title,
  question,
  failText,
  onSubmit,
  goBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmClick = () => {
    setIsSubmitting(true);
    onSubmit(
      () => {
        setIsSubmitting(false);
        goBack();
      },
      () => {
        setIsSubmitting(false);
        toast.error(failText, {
          autoClose: false,
        });
      },
    );
  };
  return (
    <FormGrid>
      <FormTitle>{title}</FormTitle>
      <p>{question}</p>
      <ButtonsGrid>
        <Button onClick={handleConfirmClick} isSubmitting={isSubmitting}>
          Yes
        </Button>
        <Button onClick={goBack}>Cancel</Button>
      </ButtonsGrid>
    </FormGrid>
  );
};

export default Confirmation;
