import React from 'react';
import NewEventForm from '../features/createEvent/NewEventForm';

const NewEvent: React.FC = () => {
  return (
    <section>
      <NewEventForm onSuccess={() => {}} />
    </section>
  );
};

export default NewEvent;
