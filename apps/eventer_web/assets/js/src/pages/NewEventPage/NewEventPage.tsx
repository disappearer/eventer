import React from 'react';
import Title from '../../components/Title';
import Top from '../../components/Top';
import NewEventForm from './NewEventForm';

const NewEventPage: React.FC = () => {
  return (
    <>
      <Top>
        <Title>New Event</Title>
      </Top>
      <NewEventForm />
    </>
  );
};

export default NewEventPage;
