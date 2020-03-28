import { Form, Formik } from 'formik';
import React from 'react';
import { addDecisionT } from './types';
import { FormTitle, FormGrid } from './Form.styles';
import TextField from '../../components/TextField';
import Button from '../../components/Button';

type valuesT = {
  title: string;
  description: string;
};

const initialValues: valuesT = {
  title: '',
  description: ''
}

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

export default AddDecisionForm;
