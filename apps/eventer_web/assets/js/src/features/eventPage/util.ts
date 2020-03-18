import { stateDecisionsT } from './stateTransformations';

type hasExistingDecisionT = (
  decisions: stateDecisionsT,
  o: 'time' | 'place',
) => boolean;
export const hasExistingDecision: hasExistingDecisionT = (
  decisions,
  objective,
) =>
  Object.entries(decisions).findIndex(
    ([_, data]) => data.objective === objective,
  ) !== -1;
