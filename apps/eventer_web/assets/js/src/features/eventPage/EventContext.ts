import React from 'react';
import { stateEventT } from './types';

export const dummyEvent: stateEventT = {
  id: 0,
  creatorId: 0,
  title: '',
  description: '',
  place: '',
  time: '',
  participants: [],
  exParticipants: [],
  decisions: [],
};

type eventContextT = {
  event: stateEventT;
  previousEvent: stateEventT;
};

const EventContext = React.createContext<eventContextT>({
  event: dummyEvent,
  previousEvent: dummyEvent,
});

export default EventContext;
