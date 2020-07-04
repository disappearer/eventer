import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import { ButtonsGrid, FormGrid, FormTitle } from '../Form.styles';
import { addDecisionT } from '../types';

type valuesT = {
  title: string;
  description: string;
};

const initialValues: valuesT = {
  title: '',
  description: '',
};

type addDecisionFromPropsT = {
  onSubmit: addDecisionT;
  onSuccess: () => void;
};

const AddDecisionForm: React.FC<addDecisionFromPropsT> = ({
  onSuccess,
  onSubmit,
}) => {
  return (
    <Formik<valuesT>
      initialValues={initialValues}
      onSubmit={(values, { setErrors, setSubmitting }) => {
        onSubmit(
          values,
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
      {({ values, handleChange, isSubmitting }) => {
        return (
          <Form>
            <FormGrid>
              <FormTitle>Create a new decision</FormTitle>
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
        );
      }}
    </Formik>
  );
};

export default AddDecisionForm;
