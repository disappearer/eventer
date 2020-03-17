import { Form, Formik } from 'formik';
import React from 'react';

type valuesT = {
  title: string;
  description: string;
};

const initialValues: valuesT = {
  title: '',
  description: ''
}

export type addDecisionT = (data: {title: string; description: string}) => void;

type addDecisionFromPropsT = {
  onSubmit: addDecisionT;
  onSuccess: () => void;
};

const AddDecisionForm: React.FC<addDecisionFromPropsT> = ({ onSuccess, onSubmit }) => {
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddDecisionForm;
