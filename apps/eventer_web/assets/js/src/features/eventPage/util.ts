export type stateEventT = eventDataT & {
  decisions: stateDecisionsT;
  participants: stateUsersT;
  exParticipants: stateUsersT;
  creatorId: number;
};

export type responseEventT = eventDataT & {
  decisions: responseDecisionsT;
  participants: responseUsersT;
  exParticipants: responseUsersT;
  creator: responseUserT;
};

type eventDataT = {
  id: number;
  title: string;
  description: string;
  place: string | null;
  time: Date | null;
};

type decisionT = {
  title: string;
  description: string;
  objective: 'place' | 'time' | 'general';
  pending: boolean;
  creator_id: number;
  resolution: string | null;
};
type stateDecisionsT = {
  [key: number]: decisionT;
};
type responseDecisionsT = (decisionT & { id: number })[];

type userT = {
  displayName: string;
  email: string;
};
type responseUserT = userT & {
  id: number;
};
type stateUsersT = {
  [key: number]: userT;
};
type responseUsersT = responseUserT[];

type mapResponseEventToStateEventT = (r: responseEventT) => stateEventT;
export const mapResponseEventToStateEvent: mapResponseEventToStateEventT = responseEvent => {
  const {
    decisions,
    participants,
    exParticipants,
    creator,
    ...eventData
  } = responseEvent;

  const stateDecisions: stateDecisionsT = decisions.reduce((sd, decision) => {
    const { id, ...decisionData } = decision;
    return {
      ...sd,
      [id]: decisionData,
    };
  }, {});

  const stateParticipants: stateUsersT = participants.reduce((sd, user) => {
    const { id, ...userData } = user;
    return {
      ...sd,
      [id]: userData,
    };
  }, {});

  const stateExParticipants: stateUsersT = exParticipants.reduce((sd, user) => {
    const { id, ...userData } = user;
    return {
      ...sd,
      [id]: userData,
    };
  }, {});

  const { id: creatorId, ...creatorData } = creator;

  return {
    ...eventData,
    creatorId,
    decisions: stateDecisions,
    participants: { ...stateParticipants, [creatorId]: creatorData },
    exParticipants: { ...stateExParticipants },
  };
};

type addUserToParticipantsT = (e: stateEventT, u: responseUserT) => stateEventT;
export const addUserToParticipants: addUserToParticipantsT = (
  currentEvent,
  joiningUser,
) => {
  const { participants, exParticipants, ...rest } = currentEvent;
  const { id, ...userData } = joiningUser;
  const { [id]: _, ...remainingExParticipants } = exParticipants;
  return {
    ...rest,
    participants: { ...participants, [id]: userData },
    exParticipants: remainingExParticipants,
  };
};

type moveToExParticipantsT = (e: stateEventT, uid: number) => stateEventT;
export const moveToExParticipants: moveToExParticipantsT = (
  currentEvent,
  userId,
) => {
  const { participants, exParticipants, ...rest } = currentEvent;
  const {
    [userId]: leavingUser,
    ...otherParticipants
  } = currentEvent.participants;
  return {
    ...rest,
    participants: otherParticipants,
    exParticipants: { ...exParticipants, [userId]: leavingUser },
  };
};

type updateStateEventT = (
  e: stateEventT,
  data: { title: string; description: string },
) => stateEventT;
export const updateStateEvent: updateStateEventT = (currentEvent, data) => {
  const { title, description } = data;
  return {
    ...currentEvent,
    title,
    description,
  };
};
