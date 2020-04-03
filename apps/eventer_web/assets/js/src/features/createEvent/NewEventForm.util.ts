import { createEventErrorsT, eventDataT } from '../../util/event_service';
import mapResponseErrors, {
  errorsT,
  responseErrorsT,
} from '../../util/mapResponseErrors';
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
export const handleIndecision: addDecisionIfUndecidedT = (
  objective,
  values,
  setFieldValue,
) => {
  const isUndecidedObjective =
    objective === 'time' ? values.timeUndecided : values.placeUndecided;
  const { decisions } = values;
  const index = decisions.findIndex(
    decision => decision.objective === objective,
  );
  if (isUndecidedObjective) {
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
  } else {
    if (index >= 0) {
      const filteredDecisions = decisions.filter((_decision, i) => i !== index);
      setFieldValue('decisions', filteredDecisions);
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

type mapErrorsT = (
  e: createEventErrorsT,
) => {
  title?: string;
  description?: string;
  time?: string;
  place?: string;
  decisions?: { title?: string; description?: string }[];
  timeUndecided?: string;
  placeUndecided?: string;
};
export const mapErrors: mapErrorsT = responseErrors => {
  const { decisions, ...restErrors } = responseErrors;
  const errors = mapResponseErrors(restErrors as responseErrorsT);
  const decisionErrors =
    decisions &&
    decisions.map(decisionErrs =>
      mapResponseErrors(decisionErrs as responseErrorsT),
    );
  return { ...errors, decisions: decisionErrors };
};
