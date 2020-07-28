import { FieldArray, Form, Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { CloseO } from '@styled-icons/evil';
import Button from '../../../../components/Button';
import CheckboxField from '../../../../components/CheckboxField';
import TextField from '../../../../components/TextField';
import { ButtonsGrid, FormGrid, FormTitle } from '../../Form.styles';
import { addPollT, pollT } from '../../types';

const PollOption = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 5px;
  align-items: center;
`;

const AddAnswerButton = styled(Button)`
  font-size: 0.7rem;
`;

const RemoveOptionIcon = styled(CloseO)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }
`;

const ActionButtons = styled(ButtonsGrid)`
  margin-top: 10px;
`;

export type pollValuesT = {
  question: string;
  custom_answer_enabled: boolean;
  multiple_answers_enabled: boolean;
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
  custom_answer_enabled: true,
  multiple_answers_enabled: false,
  options: [],
};

const AddPollForm: FunctionComponent<pollFormPropsT> = ({
  initialValues = defaultValues,
  decisionId,
  onSuccess,
  onSubmit,
}) => (
  <Formik<pollValuesT>
    initialValues={initialValues}
    onSubmit={(values, { setErrors, setSubmitting }) => {
      onSubmit(
        { decisionId, poll: values },
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
    {({ values, handleChange, isSubmitting }) => (
      <Form>
        <FormGrid>
          <FormTitle>Add poll</FormTitle>
          <TextField
            name="question"
            label="Poll question"
            onChange={handleChange}
            value={values.question}
          />
          <div>
            <CheckboxField
              name="custom_answer_enabled"
              label="Custom answer votes enabled"
              onChange={handleChange}
              checked={values.custom_answer_enabled}
            />
            <CheckboxField
              name="multiple_answers_enabled"
              label="Multiple answer votes enabled"
              onChange={handleChange}
              checked={values.multiple_answers_enabled}
            />
          </div>
          <FieldArray
            name="options"
            render={(arrayHelpers) => (
              <>
                {values.options.map((option, index) => (
                  <PollOption key={index}>
                    <TextField
                      label={`Answer ${index + 1}`}
                      name={`options[${index}].text`}
                      onChange={handleChange}
                      value={option.text}
                    />
                    <RemoveOptionIcon
                      onClick={() => arrayHelpers.remove(index)}
                    />
                  </PollOption>
                ))}
                <AddAnswerButton
                  type="button"
                  onClick={() => {
                    arrayHelpers.push({
                      text: '',
                    });
                  }}
                >
                  Add answer
                </AddAnswerButton>
              </>
            )}
          />
          <ActionButtons>
            <Button type="submit" isSubmitting={isSubmitting}>
              Submit
            </Button>
            <Button onClick={onSuccess} disabled={isSubmitting}>
              Cancel
            </Button>
          </ActionButtons>
        </FormGrid>
      </Form>
    )}
  </Formik>
);

export default AddPollForm;
