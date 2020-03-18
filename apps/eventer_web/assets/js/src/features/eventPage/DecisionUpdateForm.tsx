import { Form, Formik } from 'formik';
import React from 'react';
import { updateDecisionT } from './types';

type valuesT = {
  title: string;
  description: string;
};

type decisionUpdateFromPropT = {
  initialValues: {
    title: string;
    description: string;
  };
  id: number;
  onSubmit: updateDecisionT;
  onSuccess: () => void;
};

const DecisionUpdateForm: React.FC<decisionUpdateFromPropT> = ({
  initialValues,
  id,
  onSuccess,
  onSubmit,
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={handleChange}
              value={values.title}
            />
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              value={values.description}
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={onSuccess}>
              Cancel
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DecisionUpdateForm;
