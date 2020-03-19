import {
  responseDecisionT,
  responseEventT,
  responseUserT,
  stateDecisionsT,
  stateEventT,
  stateUsersT,
  pollT,
} from './types';

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
export const addStateDecision: addStateDecisionT = (currentEvent, data) => {
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

type removeStateDecisionT = (e: stateEventT, decisionId: number) => stateEventT;
export const removeStateDecision: removeStateDecisionT = (
  currentEvent,
  decisionId,
) => {
  const { decisions } = currentEvent;

  const { [decisionId]: _, ...remainingDecisions } = decisions;

  return {
    ...currentEvent,
    decisions: remainingDecisions,
  };
};

type discardStateResolutionT = (
  e: stateEventT,
  decisionId: number,
) => stateEventT;
export const discardStateResolution: discardStateResolutionT = (
  currentEvent,
  decisionId,
) => {
  const { decisions } = currentEvent;

  const { [decisionId]: decision } = decisions;

  return {
    ...currentEvent,
    decisions: {
      ...decisions,
      [decisionId]: { ...decision, pending: true, resolution: null },
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

type addStatePollT = (
  e: stateEventT,
  decisionId: number,
  poll: pollT,
) => stateEventT;
export const addStatePoll: addStatePollT = (
  currentEvent,
  decisionId,
  poll
) => {
  const { decisions } = currentEvent;
  const { [decisionId]: decision } = decisions;

  return {
    ...currentEvent,
    decisions: {
      ...decisions,
      [decisionId]: { ...decision, poll },
    },
  };
};
