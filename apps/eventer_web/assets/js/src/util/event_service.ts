import { post } from './api';

export type eventDataT = {
  title: string;
  description: string;
  time: Date | null;
  place: string | null;
};

type createEventBodyT = {
  event: eventDataT;
};

type createEventSuccessResponseT = { ok: true, event_id_hash: string };
type createEventErrorResponseT = { ok: false, errors: any };
type responseT = createEventSuccessResponseT | createEventErrorResponseT;

type createEventT = (data: eventDataT) => Promise<responseT>;
export const createEvent: createEventT = async eventData => {
  const event = await post<responseT, createEventBodyT>(
    '/api/events',
    { event: eventData },
  );
  return event;
};
