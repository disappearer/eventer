export type stateEventT = eventDataT & {
  decisions: stateDecisionsT;
  participants: stateUsersT;
  creatorId: number;
};

export type responseEventT = eventDataT & {
  decisions: responseDecisionsT;
  participants: responseUsersT;
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
  const { decisions, participants, creator, ...eventData } = responseEvent;

  const stateDecisions: stateDecisionsT = decisions.reduce((sd, decision) => {
    const { id, ...decisionData } = decision;
    return {
      ...sd,
      [id]: decisionData,
    };
  }, {});

  const stateUsers: stateUsersT = participants.reduce((sd, user) => {
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
    participants: { ...stateUsers, [creatorId]: creatorData },
  };
};

type addUserToParticipantsT = (e: stateEventT, u: responseUserT) => stateEventT;
export const addUserToParticipants: addUserToParticipantsT = (
  currentEvent,
  joiningUser,
) => {
  const { participants, ...rest } = currentEvent;
  const { id, ...userData } = joiningUser;
  return {
    ...rest,
    participants: { ...participants, [id]: userData },
  };
};
