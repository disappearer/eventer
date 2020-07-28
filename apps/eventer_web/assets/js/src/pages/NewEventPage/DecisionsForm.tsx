/* eslint-disable react/no-array-index-key */
import { FieldArray } from 'formik';
import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { shouldShowDecision, valuesT } from './NewEventForm.util';

const DecisionsTitle = styled.h2`
  justify-self: center;
  margin: 0;
`;

const DecisionFields = styled.div`
  display: grid;
  grid-row-gap: 19px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  justify-items: center;
`;

const NewDecisionForm = styled.div`
  display: grid;
  grid-row-gap: 17px;
`;

const AddDecisionButton = styled(Button)`
  justify-self: center;
  align-self: center;
`;

type decisionFormPropsT = {
  values: valuesT;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const DecisionsForm: React.FC<decisionFormPropsT> = ({ values, onChange }) => (
  <>
    <DecisionsTitle>Decisions</DecisionsTitle>
    <FieldArray
      name="decisions"
      render={(arrayHelpers) => (
        <DecisionFields>
          {values.decisions.map((decision, index) => {
            let placeholder; let
              label;
            switch (decision.objective) {
              case 'time':
                placeholder = 'When?';
                label = 'Title - time decision';
                break;
              case 'place':
                placeholder = 'Where?';
                label = 'Title - place decision';
                break;
              default:
                label = 'Title';
            }
            return (
              shouldShowDecision(decision, values) && (
              <NewDecisionForm key={index}>
                <TextField
                  name={`decisions[${index}].title`}
                  label={label}
                  placeholder={placeholder}
                  onChange={onChange}
                  value={decision.title}
                />
                <TextField
                  name={`decisions[${index}].description`}
                  label="Description (optional)"
                  onChange={onChange}
                  value={decision.description}
                />
                {decision.objective === 'general' && (
                <div>
                  <Button type="button" onClick={() => arrayHelpers.remove(index)}>
                    Remove decision
                  </Button>
                </div>
                )}
              </NewDecisionForm>
              )
            );
          })}
          <AddDecisionButton
            type="button"
            onClick={() => {
              arrayHelpers.push({
                title: '',
                description: '',
                objective: 'general',
              });
            }}
          >
            Add decision
          </AddDecisionButton>
        </DecisionFields>
      )}
    />
  </>
);

export default DecisionsForm;
