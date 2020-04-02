import { FieldArray, Form, Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import TextField from '../../components/TextField';
import { ButtonsGrid, FormGrid, FormTitle } from './Form.styles';
import { addPollT, pollT } from './types';

const PollOption = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 5px;
  align-items: center;
`;

export type pollValuesT = {
  question: string;
  fixed: boolean;
  multiple_votes: boolean;
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
  multiple_votes: false,
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
            <FormTitle>Add poll</FormTitle>
            <FormGrid>
              <TextField
                name="question"
                label="Poll question"
                onChange={handleChange}
                value={values.question}
              />
              <div>
                <CheckboxField
                  name="fixed"
                  label="Custom answers disabled"
                  onChange={handleChange}
                  checked={values.fixed}
                />
                <CheckboxField
                  name="multiple_votes"
                  label="Multiple answer votes enabled"
                  onChange={handleChange}
                  checked={values.multiple_votes}
                />
              </div>
              <FieldArray
                name="options"
                render={arrayHelpers => (
                  <>
                    {values.options.map((option, index) => (
                      <PollOption key={index}>
                        <TextField
                          label={`Answer ${index + 1}`}
                          name={`options[${index}].text`}
                          onChange={handleChange}
                          value={option.text}
                        />
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          x
                        </Button>
                      </PollOption>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        arrayHelpers.push({
                          text: '',
                        });
                      }}
                    >
                      Add answer
                    </Button>
                  </>
                )}
              />
              <ButtonsGrid>
                <Button type="submit">Submit</Button>
                <Button onClick={onSuccess}>Cancel</Button>
              </ButtonsGrid>
            </FormGrid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PollForm;
