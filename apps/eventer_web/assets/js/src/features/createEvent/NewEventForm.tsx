import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEvent } from '../../util/event_service';
import {
  addDecisionIfUndecided,
  mapValuesToEventData,
  shouldShowDecision,
  valuesT,
} from './NewEventForm.util';

const initialValues = {
  title: '',
  description: '',
  time: new Date(),
  timeUndecided: false,
  place: '',
  placeUndecided: false,
  decisions: [],
};

type newEventFormPropT = {
  onSuccess: () => void;
};
const NewEventForm: React.FC<newEventFormPropT> = ({ onSuccess }) => {
  return (
    <Formik<valuesT>
      initialValues={initialValues}
      onSubmit={async values => {
        const response = await createEvent(mapValuesToEventData(values));
        switch (response.ok) {
          case false:
            console.log('NewEventForm -> response.errors', response.errors);
            break;
          case true:
            onSuccess();
            break;
        }
      }}
    >
      {({ values, handleChange, setFieldValue }) => {
        addDecisionIfUndecided('time', values, setFieldValue);
        addDecisionIfUndecided('place', values, setFieldValue);
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
            <div className="input-group">
              <label htmlFor="time">Time</label>
              <DatePicker
                name="time"
                showTimeSelect
                timeIntervals={15}
                selected={values.timeUndecided ? null : values.time}
                onChange={time => setFieldValue('time', time)}
                dateFormat="MMMM d, yyyy h:mm aa"
                disabled={values.timeUndecided}
              />
              <input
                id="timeUndecided"
                name="timeUndecided"
                type="checkbox"
                onChange={handleChange}
              />
              <label htmlFor="timeUndecided">Time undecided</label>
            </div>
            <div className="input-group">
              <label htmlFor="place">Place</label>
              <input
                id="place"
                name="place"
                type="text"
                onChange={handleChange}
                value={values.placeUndecided ? '' : values.place}
                disabled={values.placeUndecided}
              />
              <input
                id="placeUndecided"
                name="placeUndecided"
                type="checkbox"
                onChange={handleChange}
              />
              <label htmlFor="placeUndecided">Place undecided</label>
            </div>
            <h2>Decisions</h2>
            <FieldArray
              name="decisions"
              render={arrayHelpers => (
                <div>
                  {values.decisions.map(
                    (decision, index) =>
                      shouldShowDecision(decision, values) && (
                        <div key={index}>
                          <label htmlFor={`decisions[${index}].title`}>
                            Title
                          </label>
                          <input
                            name={`decisions[${index}].title`}
                            onChange={handleChange}
                            value={decision.title}
                          />
                          <label htmlFor={`decisions[${index}].description`}>
                            Description
                          </label>
                          <input
                            name={`decisions[${index}].description`}
                            onChange={handleChange}
                            value={decision.description}
                          />
                          <label htmlFor="objective">Objective</label>
                          <span>{decision.objective}</span>
                        </div>
                      ),
                  )}
                  <button
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
                  </button>
                </div>
              )}
            />
            <button type="submit">Submit</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewEventForm;
