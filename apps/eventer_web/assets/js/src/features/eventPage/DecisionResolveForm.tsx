import { Form, Formik } from 'formik';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import TimeField from '../../components/TimeField';
import { ButtonsGrid, FormGrid, FormTitle } from './Form.styles';
import { objectiveT, resolutionT, resolveDecisionT } from './types';

type valuesT = {
  resolution: resolutionT;
};

type resolveFormPropsT = {
  id: number;
  objective: objectiveT;
  onSubmit: resolveDecisionT;
  onSuccess: () => void;
  formTitle: string;
};

const DecisionResolveForm: React.FC<resolveFormPropsT> = ({
  id,
  objective,
  onSubmit,
  onSuccess,
  formTitle,
}) => {
  return (
    <Formik<valuesT>
      initialValues={{ resolution: objective === 'time' ? new Date() : '' }}
      onSubmit={(values, { setErrors, setSubmitting }) => {
        onSubmit(
          { decisionId: id, ...values },
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
      {({ values, handleChange, setFieldValue, isSubmitting }) => {
        return (
          <Form>
            <FormTitle>{formTitle}</FormTitle>
            <FormGrid>
              {objective === 'time' ? (
                <TimeField
                  name="resolution"
                  selected={values.resolution as Date}
                  onChange={(time) => setFieldValue('resolution', time)}
                  disabled={false}
                />
              ) : (
                <TextField
                  label="Resolution"
                  name="resolution"
                  onChange={handleChange}
                  value={values.resolution as string}
                />
              )}
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

export default DecisionResolveForm;
