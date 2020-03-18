import { specificObjectiveT, stateDecisionsT } from './types';

type hasExistingDecisionT = (
  decisions: stateDecisionsT,
  objective: specificObjectiveT,
) => boolean;
export const hasExistingDecision: hasExistingDecisionT = (
  decisions,
  objective,
) =>
  Object.entries(decisions).findIndex(
    ([_, data]) => data.objective === objective,
  ) !== -1;
