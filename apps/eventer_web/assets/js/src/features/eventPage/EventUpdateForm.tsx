import { Form, Formik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextField from '../../components/TextField';

const FormTitle = styled.h3`
  margin-top: 0;
`;

const FormGrid = styled.div`
  display: grid;
  justify-items: start;
  grid-gap: 17px;
`;

type valuesT = {
  title: string;
  description: string;
};

export type updateEventT = (data: {
  title: string;
  description: string;
}) => void;

type eventUpdateFromPropsT = {
  initialValues: {
    title: string;
    description: string;
  };
  onSubmit: updateEventT;
  onSuccess: () => void;
  formTitle: string;
};

const EventUpdateForm: React.FC<eventUpdateFromPropsT> = ({
  initialValues,
  onSuccess,
  onSubmit,
  formTitle,
}) => {
  return (
    <Formik<valuesT>
      initialValues={initialValues}
      onSubmit={async values => {
        onSubmit(values);
        onSuccess();
      }}
    >
      {({ values, handleChange }) => {
        return (
          <div>
            <FormTitle>{formTitle}</FormTitle>
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
                  label="Description"
                  onChange={handleChange}
                  value={values.description}
                />

                <Button type="submit">Submit</Button>
              </FormGrid>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default EventUpdateForm;
