import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { FormGrid, FormTitle, ButtonsGrid } from './Form.styles';
import { updateEventT } from './types';

type valuesT = {
  title: string;
  description: string;
};

type eventUpdateFromPropsT = {
  initialValues: {
    title: string;
    description: string;
  };
  onSubmit: updateEventT;
  onSuccess: () => void;
};

const EventUpdateForm: React.FC<eventUpdateFromPropsT> = ({
  initialValues,
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
          <FormGrid>
            <FormTitle>Edit event</FormTitle>
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
          </FormGrid>
        );
      }}
    </Formik>
  );
};

export default EventUpdateForm;
