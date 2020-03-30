import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { ButtonsGrid, FormGrid, FormTitle } from './Form.styles';
import { updateDecisionT } from './types';

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
  formTitle: string;
};

const DecisionUpdateForm: React.FC<decisionUpdateFromPropsT> = ({
  initialValues,
  id,
  onSuccess,
  onSubmit,
  formTitle,
}) => {
  return (
    <Formik<valuesT>
      initialValues={initialValues}
      onSubmit={async values => {
        onSubmit({ ...values, id });
        onSuccess();
      }}
    >
      {({ values, handleChange }) => {
        return (
          <Form>
            <FormTitle>{formTitle}</FormTitle>
            <FormGrid>
              <TextField
                name="title"
                label="Title"
                onChange={handleChange}
                value={values.title}
              />
              <TextField
                name="description"
                label="Description"
                onChange={handleChange}
                value={values.description}
              />
              <ButtonsGrid>
                <Button type="submit">Submit</Button>
                <Button onClick={onSuccess}>Cancel</Button>
              </ButtonsGrid>
            </FormGrid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DecisionUpdateForm;
