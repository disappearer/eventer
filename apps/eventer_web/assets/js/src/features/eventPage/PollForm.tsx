import { Form, Formik, FieldArray } from 'formik';
import React, { FunctionComponent } from 'react';
import { addPollT, pollT } from './types';

export type pollValuesT = {
  question: string;
  fixed: boolean;
  options: {
    text: string;
    id: string | undefined;
  }[];
};

type pollFormPropsT = {
  initialValues?: pollT;
  decisionId: number;
  onSubmit: addPollT;
  onSuccess: () => void;
};

const defaultValues: pollValuesT = {
  question: '',
  fixed: false,
  options: [],
};

const PollForm: FunctionComponent<pollFormPropsT> = ({
  initialValues = defaultValues,
  decisionId,
  onSuccess,
  onSubmit,
}) => {
  return (
    <Formik<pollValuesT>
      initialValues={initialValues}
      onSubmit={async values => {
        onSubmit(decisionId, values);
        onSuccess();
      }}
    >
      {({ values, handleChange }) => {
        return (
          <Form>
            <label htmlFor="question">Poll question</label>
            <input
              id="question"
              name="question"
              type="text"
              onChange={handleChange}
              value={values.question}
            />
            <label htmlFor="fixed">Fixed options</label>
            <input
              id="fixed"
              name="fixed"
              type="checkbox"
              onChange={handleChange}
              checked={values.fixed}
            />
            <FieldArray
              name="options"
              render={arrayHelpers => (
                <div>
                  {values.options.map((option, index) => (
                    <div key={index}>
                      <label htmlFor={`options[${index}].text`}>
                        Option {index + 1}
                      </label>
                      <input
                        name={`options[${index}].text`}
                        onChange={handleChange}
                        value={option.text}
                      />
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      arrayHelpers.push({
                        text: '',
                      });
                    }}
                  >
                    Add option
                  </button>
                </div>
              )}
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

export default PollForm;
