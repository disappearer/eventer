import { pollValuesT } from './PollForm';

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

export type eventDataT = {
  id: number;
  title: string;
  description: string;
  place: string | null;
  time: string | null;
};

export type specificObjectiveT = 'time' | 'place';
export type objectiveT = specificObjectiveT | 'general';

export type optionT = {
  id: string;
  text: string;
  votes: number[];
}

export type pollT = {
  question: string;
  fixed: boolean;
  multiple_votes: boolean;
  voted_by: number[];
  options: optionT[];
}

export type decisionT = {
  title: string;
  description: string;
  objective: objectiveT;
  pending: boolean;
  creator_id: number;
  resolution: string | null;
  poll: pollT | null;
};
export type responseDecisionT = decisionT & { id: number };
export type stateDecisionsT = {
  [key: number]: decisionT;
};
export type responseDecisionsT = responseDecisionT[];

export type userT = {
  displayName: string;
  email: string;
};
export type responseUserT = userT & {
  id: number;
};
export type stateUsersT = {
  [key: number]: userT;
};
export type responseUsersT = responseUserT[];

export type updateEventT = (data: {
  title: string;
  description: string;
}) => void;

export type addDecisionT = (data: {
  title: string;
  description: string;
}) => void;

export type removeDecisionT = (id: number) => void;

export type updateDecisionT = (data: {
  id: number;
  title: string;
  description: string;
}) => void;

export type resolutionT = Date | string;

export type resolveDecisionT = (id: number, resolution: resolutionT) => void;

export type discardResolutionT = (id: number) => void;

export type addPollT = (decisionId: number, poll: pollValuesT) => void;

type customOptionT = {
  text: string;
};
export type voteT = (
  decisionId: number,
  customOption: customOptionT | null,
  optionsVotedFor: string[],
) => void;
