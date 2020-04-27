import { useState, useCallback } from 'react';
import { discardResolutionT } from './types';

type decisionActionT =
  | 'view'
  | 'edit'
  | 'resolve'
  | 'discard_resolution'
  | 'add_poll';

type useDecisionActionsT = (
  decisionId: number,
  onResolutionDiscard: discardResolutionT,
) => {
  decisionAction: decisionActionT;
  showEditForm: () => void;
  showResolveForm: () => void;
  resetDecisionModal: () => void;
  showDiscardConfirmation: () => void;
  discardResolution: () => void;
  showAddPollForm: () => void;
};
export const useDecisionActions: useDecisionActionsT = (
  decisionId,
  onResolutionDiscard,
) => {
  const [decisionAction, setDecisionAction] = useState<decisionActionT>('view');

  const showEditForm = useCallback(() => {
    setDecisionAction('edit');
  }, [setDecisionAction]);

  const showResolveForm = useCallback(() => {
    setDecisionAction('resolve');
  }, [setDecisionAction]);

  const resetDecisionModal = useCallback(() => {
    setDecisionAction('view');
  }, [setDecisionAction]);

  const showDiscardConfirmation = useCallback(() => {
    setDecisionAction('discard_resolution');
  }, [setDecisionAction]);

  const discardResolution = useCallback(() => {
    onResolutionDiscard(decisionId);
    resetDecisionModal();
  }, [setDecisionAction]);

  const showAddPollForm = useCallback(() => {
    setDecisionAction('add_poll');
  }, [setDecisionAction]);

  return {
    decisionAction,
    showEditForm,
    showResolveForm,
    resetDecisionModal,
    showDiscardConfirmation,
    discardResolution,
    showAddPollForm,
  };
};
