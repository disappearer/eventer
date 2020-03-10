import { post, get } from './api';

export type eventDataT = {
  title: string;
  description: string;
  time: Date | null;
  place: string | null;
};

type createEventBodyT = {
  event: eventDataT;
};

type createEventSuccessResponseT = { ok: true; event_id_hash: string };
type createEventErrorResponseT = { ok: false; errors: any };
type createEventResponseT =
  | createEventSuccessResponseT
  | createEventErrorResponseT;

type createEventT = (data: eventDataT) => Promise<createEventResponseT>;
export const createEvent: createEventT = async eventData => {
  const event = await post<createEventResponseT, createEventBodyT>(
    '/api/events',
    { event: eventData },
  );
  return event;
};

type listEventsT = (data: eventDataT) => Promise<createEventResponseT>;
export const listEvents: listEventsT = async eventData => {
  const event = await get<createEventResponseT>('/api/events');
  return event;
};
