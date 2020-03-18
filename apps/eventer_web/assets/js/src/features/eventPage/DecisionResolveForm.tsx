import { Form, Formik } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { objectiveT } from './stateTransformations';

type resolutionT = Date | string;

type valuesT = {
  resolution: resolutionT;
};

export type resolveDecisionT = (id: number, resolution: resolutionT) => void;

type resolveFormPropsT = {
  id: number;
  objective: objectiveT;
  onSubmit: resolveDecisionT;
  onSuccess: () => void;
};

const DecisionResolveForm: React.FC<resolveFormPropsT> = ({
  id,
  objective,
  onSubmit,
  onSuccess,
}) => {
  return (
    <Formik<valuesT>
      initialValues={{ resolution: objective === 'time' ? new Date() : '' }}
      onSubmit={async ({ resolution }) => {
        onSubmit(id, resolution);
        onSuccess();
      }}
    >
      {({ values, handleChange, setFieldValue }) => {
        return (
          <Form>
            <label htmlFor="resolution">Resolution</label>
            {objective === 'time' ? (
              <DatePicker
                name="resolution"
                showTimeSelect
                timeIntervals={15}
                selected={values.resolution as Date}
                onChange={time => setFieldValue('resolution', time)}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            ) : (
              <input
                id="resolution"
                name="resolution"
                type="text"
                onChange={handleChange}
                value={values.resolution as string}
              />
            )}

            <button type="submit">Submit</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DecisionResolveForm;
