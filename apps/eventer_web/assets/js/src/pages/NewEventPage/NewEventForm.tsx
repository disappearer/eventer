import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import TextField from '../../components/TextField';
import TimeField from '../../components/TimeField';
import { createEvent } from '../../util/eventService';
import DecisionsForm from './DecisionsForm';
import {
  handleIndecision,
  mapValuesToEventData,
  valuesT,
} from './NewEventForm.util';

const FormGrid = styled.div`
  display: grid;
  grid-gap: 29px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-gap: 13px;
  justify-items: center;
  align-items: center;
`;

const SubmitButton = styled(Button)`
  justify-self: center;
`;

const initialValues = {
  title: '',
  description: '',
  time: new Date(),
  timeUndecided: false,
  place: '',
  placeUndecided: false,
  decisions: [],
};

const NewEventForm: React.FC = () => {
  const history = useHistory();
  return (
    <Formik<valuesT>
      initialValues={initialValues}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const response = await createEvent(mapValuesToEventData(values));
        setSubmitting(false);
        switch (response.ok) {
          case false:
            setErrors(response.errors);
            break;
          case true:
            history.push('/');
            break;
        }
      }}
    >
      {({ values, handleChange, setFieldValue, isSubmitting }) => {
        handleIndecision('time', values, setFieldValue);
        handleIndecision('place', values, setFieldValue);
        return (
          <Form>
            <FormGrid>
              <FormGroup>
                <TextField
                  name="title"
                  label="Title"
                  onChange={handleChange}
                  value={values.title}
                />
                <TextField
                  name="description"
                  label="Description (optional)"
                  onChange={handleChange}
                  value={values.description}
                />
              </FormGroup>
              <FormGroup>
                <div>
                  <TimeField
                    selected={values.timeUndecided ? null : values.time}
                    onChange={(time) => setFieldValue('time', time)}
                    disabled={values.timeUndecided}
                  />
                  <CheckboxField
                    name="timeUndecided"
                    label="Time undecided"
                    checked={values.timeUndecided}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <TextField
                    name="place"
                    label="Place"
                    onChange={handleChange}
                    value={values.place}
                    disabled={values.placeUndecided}
                  />
                  <CheckboxField
                    name="placeUndecided"
                    label="Place undecided"
                    checked={values.placeUndecided}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>

              <DecisionsForm values={values} onChange={handleChange} />

              <SubmitButton
                primary
                type="submit"
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
              >
                Create event
              </SubmitButton>
            </FormGrid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewEventForm;
