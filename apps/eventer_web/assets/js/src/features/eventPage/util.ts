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
  time: string | null;
};

export type objectiveT = 'place' | 'time' | 'general';

export type decisionT = {
  title: string;
  description: string;
  objective: objectiveT;
  pending: boolean;
  creator_id: number;
  resolution: string | null;
};
type responseDecisionT = decisionT & { id: number };
export type stateDecisionsT = {
  [key: number]: decisionT;
};
type responseDecisionsT = responseDecisionT[];

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

type addStateDecisionT = (
  e: stateEventT,
  decision: responseDecisionT,
) => stateEventT;
export const addStateDecision: addStateDecisionT = (
  currentEvent,
  data,
) => {
  const { id, ...decisionData } = data;
  const { decisions } = currentEvent;
  return {
    ...currentEvent,
    decisions: {
      ...decisions,
      [id]: decisionData,
    },
  };
};

type updateStateDecisionT = (
  e: stateEventT,
  data: { id: number; title: string; description: string },
) => stateEventT;
export const updateStateDecision: updateStateDecisionT = (
  currentEvent,
  data,
) => {
  const { id, title, description } = data;
  const { decisions } = currentEvent;

  const { [id]: decisionToUpdate } = decisions;

  return {
    ...currentEvent,
    decisions: {
      ...decisions,
      [id]: { ...decisionToUpdate, title, description },
    },
  };
};

type resolveStateDecisionT = (
  e: stateEventT,
  data: { id: number; resolution: string },
) => stateEventT;
export const resolveStateDecision: resolveStateDecisionT = (
  currentEvent,
  data,
) => {
  const { id, resolution } = data;
  const { decisions } = currentEvent;

  const { [id]: resolvedDecision } = decisions;

  return {
    ...currentEvent,
    time:
      resolvedDecision.objective === 'time' ? resolution : currentEvent.time,
    place:
      resolvedDecision.objective === 'place' ? resolution : currentEvent.place,
    decisions: {
      ...decisions,
      [id]: { ...resolvedDecision, resolution, pending: false },
    },
  };
};

type openStateDiscussionT = (
  e: stateEventT,
  data:
    | { status: 'new'; decision: responseDecisionT }
    | { status: 'updated'; decision: responseDecisionT },
) => stateEventT;
export const openStateDiscussion: openStateDiscussionT = (
  currentEvent,
  data,
) => {
  const { decisions } = currentEvent;
  const {
    decision: { id, ...decisionData },
  } = data;

  return {
    ...currentEvent,
    time: decisionData.objective === 'time' ? null : currentEvent.time,
    place: decisionData.objective === 'place' ? null : currentEvent.place,
    decisions: { ...decisions, [id]: decisionData },
  };
};
