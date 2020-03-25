import { eventDataT } from '../../util/event_service';
import { objectiveT, specificObjectiveT } from '../eventPage/types';

type decisionT = {
  title: string;
  description: string;
  objective: objectiveT;
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
  objective: specificObjectiveT,
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
          title: '',
          description: '',
          objective: objective,
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
