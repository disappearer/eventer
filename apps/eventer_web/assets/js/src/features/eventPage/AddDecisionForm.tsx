import { Form, Formik } from 'formik';
import React from 'react';
import { addDecisionT } from './types';
import { FormTitle, FormGrid, ButtonsGrid } from './Form.styles';
import TextField from '../../components/TextField';
import Button from '../../components/Button';

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
          <div>
            <FormTitle>Create a new decision</FormTitle>
            <Form>
              <FormGrid>
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
          </div>
        );
      }}
    </Formik>
  );
};

export default AddDecisionForm;
