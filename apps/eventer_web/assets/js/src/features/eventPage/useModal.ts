import { None, Option, Some } from 'funfix';
import { useState, useCallback } from 'react';
import { specificObjectiveT } from './types';

type eventUpdateFormModalChildT = {
  component: 'EventUpdateForm';
};

type decisionModalChildT = {
  component: 'Decision';
  id: number;
};

type addDecisionModalChildT = {
  component: 'AddDecisionForm';
};

type removeDecisionModalChildT = {
  component: 'RemoveDecisionConfirmation';
  id: number;
};

type openDiscussionModalChildT = {
  component: 'OpenDiscussionConfirmation';
  objective: specificObjectiveT;
};

type modalChildT =
  | eventUpdateFormModalChildT
  | addDecisionModalChildT
  | decisionModalChildT
  | removeDecisionModalChildT
  | openDiscussionModalChildT;

type useModalT = () => {
  shouldShowModal: boolean;
  modalChild: Option<modalChildT>;
  showEditModal: () => void;
  showAddDecisionModal: () => void;
  showRemoveDecisionModal: (id: number) => void;
  showDecisionModal: (id: number) => void;
  showOpenDiscussionModal: (o: specificObjectiveT) => void;
  hideModal: () => void;
};

const useModal: useModalT = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalChild, setModalChild] = useState<Option<modalChildT>>(None);

  const showEditModal = useCallback(() => {
    setModalChild(Some({ component: 'EventUpdateForm' }));
    setShouldShowModal(true);
  }, [setModalChild, setShouldShowModal]);

  const showAddDecisionModal = useCallback(() => {
    setModalChild(Some({ component: 'AddDecisionForm' }));
    setShouldShowModal(true);
  }, [setModalChild, setShouldShowModal]);

  const showRemoveDecisionModal = useCallback(
    (id: number) => {
      setModalChild(Some({ component: 'RemoveDecisionConfirmation', id }));
      setShouldShowModal(true);
    },
    [setModalChild, setShouldShowModal],
  );

  const showDecisionModal = useCallback(
    (id: number) => {
      setModalChild(Some({ component: 'Decision', id }));
      setShouldShowModal(true);
    },
    [setModalChild, setShouldShowModal],
  );

  const showOpenDiscussionModal = useCallback(
    (objective: specificObjectiveT) => {
      setModalChild(
        Some({ component: 'OpenDiscussionConfirmation', objective }),
      );
      setShouldShowModal(true);
    },
    [setModalChild, setShouldShowModal],
  );

  const hideModal = useCallback(() => {
    setModalChild(None);
    setShouldShowModal(false);
  }, [setModalChild, setShouldShowModal]);

  return {
    shouldShowModal,
    modalChild,
    showEditModal,
    showAddDecisionModal,
    showRemoveDecisionModal,
    showDecisionModal,
    showOpenDiscussionModal,
    hideModal,
  };
};

export default useModal;
