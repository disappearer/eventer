import { eventDataT } from "../../util/event_service";

type decisionT = {
  title: string;
  description: string;
  objective: 'time' | 'place' | 'general';
};

export type valuesT = {
  title: string;
  description: string;
  time: Date;
  place: string;
  decisions: decisionT[];
  timeUndecided: boolean;
  placeUndecided: boolean;
};

type mapValuesToEventDataT = (v: valuesT) => eventDataT;
export const mapValuesToEventData: mapValuesToEventDataT = values => {
  const { timeUndecided, placeUndecided, ...otherValues } = values;
  return {
    ...otherValues,
    time: timeUndecided ? null : otherValues.time,
    place: placeUndecided ? null : otherValues.place,
  };
};

type addDecisionIfUndecidedT = (
  objective: 'time' | 'place',
  values: valuesT,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void,
) => void;
export const addDecisionIfUndecided: addDecisionIfUndecidedT = (
  objective,
  values,
  setFieldValue,
) => {
  const isUndecidedObjective =
  objective === 'time' ? values.timeUndecided : values.placeUndecided;
  if (isUndecidedObjective) {
    const { decisions } = values;
    const index = decisions.findIndex(
      decision => decision.objective === objective,
    );
    if (index === -1) {
      setFieldValue('decisions', [
        {
          title: objective === 'time' ? 'When' : 'Where',
          description: '',
          objective: objective,
          fixedObjective: true,
        },
        ...decisions,
      ]);
    }
  }
};

type shouldShowDecisionT = (decision: decisionT, values: valuesT) => boolean;
export const shouldShowDecision: shouldShowDecisionT = (decision, values) => {
  return (
    decision.objective === 'general' ||
    (decision.objective === 'time' && values.timeUndecided) ||
    (decision.objective === 'place' && values.placeUndecided)
  );
};
