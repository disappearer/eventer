import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import { ButtonsGrid, FormGrid, FormTitle } from '../../Form.styles';
import { updateDecisionT } from '../../types';

type valuesT = {
  title: string;
  description: string;
};

type decisionUpdateFromPropsT = {
  initialValues: {
    title: string;
    description: string;
  };
  id: number;
  onSubmit: updateDecisionT;
  onSuccess: () => void;
};

const DecisionUpdateForm: React.FC<decisionUpdateFromPropsT> = ({
  initialValues,
  id,
  onSuccess,
  onSubmit,
}) => (
  <Formik<valuesT>
    initialValues={initialValues}
    onSubmit={(values, { setErrors, setSubmitting }) => {
      onSubmit(
        { id, ...values },
        () => {
          setSubmitting(false);
          onSuccess();
        },
        (errors) => {
          setSubmitting(false);
          setErrors(errors);
        },
      );
    }}
  >
    {({ values, handleChange, isSubmitting }) => (
      <Form>
        <FormGrid>
          <FormTitle>Edit decision</FormTitle>
          <TextField
            name="title"
            label="Title"
            onChange={handleChange}
            value={values.title}
          />
          <TextField
            name="description"
            label="Description (optional)"
            onChange={handleChange}
            value={values.description}
          />
          <ButtonsGrid>
            <Button type="submit" isSubmitting={isSubmitting}>
              Submit
            </Button>
            <Button onClick={onSuccess} disabled={isSubmitting}>
              Cancel
            </Button>
          </ButtonsGrid>
        </FormGrid>
      </Form>
    )}
  </Formik>
);

export default DecisionUpdateForm;
