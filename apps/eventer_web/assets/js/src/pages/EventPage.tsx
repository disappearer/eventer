import { None, Option, Some } from 'funfix';
import React, { useCallback, useState } from 'react';
import Modal from '../components/Modal';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import AddDecisionForm from '../features/eventPage/AddDecisionForm';
import BasicEventData from '../features/eventPage/BasicEventData';
import Decision from '../features/eventPage/Decision';
import Decisions from '../features/eventPage/Decisions';
import EventUpdateForm from '../features/eventPage/EventUpdateForm';
import RemoveDecisionConfirmation from '../features/eventPage/RemoveDecisionConfirmation';
import useChannel from '../features/eventPage/useChannel';
import useChannelCallbacks from '../features/eventPage/useChannelCallbacks';
import { stateEventT } from '../features/eventPage/util';

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

type modalChildT =
  | eventUpdateFormModalChildT
  | addDecisionModalChildT
  | decisionModalChildT
  | removeDecisionModalChildT;

const EventPage: React.FC = () => {
  const { token, id: currentUserId } = useAuthorizedUser();
  const [event, setEvent] = useState<Option<stateEventT>>(None);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalChild, setModalChild] = useState<Option<modalChildT>>(None);

  const { channel } = useChannel(token, setEvent);

  const {
    joinEvent,
    leaveEvent,
    updateEvent,
    addDecision,
    updateDecision,
    openTimeDiscussion,
    openPlaceDiscussion,
    resolveDecision,
    removeDecision,
  } = useChannelCallbacks(channel);

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

  const hideModal = useCallback(() => {
    setModalChild(None);
    setShouldShowModal(false);
  }, [setModalChild, setShouldShowModal]);

  return (
    <section>
      {event.fold(
        () => (
          <div>Loading event data...</div>
        ),
        event => {
          const { title, description, decisions } = event;
          return (
            <>
              <BasicEventData
                event={event}
                currentUserId={currentUserId}
                onEditEventClick={showEditModal}
                onDiscussTimeClick={openTimeDiscussion}
                onDiscussPlaceClick={openPlaceDiscussion}
                joinEvent={joinEvent}
                leaveEvent={leaveEvent}
              />
              <Decisions
                decisions={decisions}
                onDecisionClick={showDecisionModal}
                onAddDecisionClick={showAddDecisionModal}
                onRemoveDecisionClick={showRemoveDecisionModal}
              />
              <Modal shouldShowModal={shouldShowModal} hideModal={hideModal}>
                {modalChild.fold(
                  () => null,
                  child => {
                    switch (child.component) {
                      case 'EventUpdateForm':
                        return (
                          <EventUpdateForm
                            initialValues={{ title, description }}
                            onSuccess={hideModal}
                            onSubmit={updateEvent}
                          />
                        );
                      case 'Decision':
                        return (
                          <Decision
                            id={child.id}
                            data={decisions[child.id]}
                            onDecisionResolve={resolveDecision}
                            onDecisionUpdate={updateDecision}
                          />
                        );
                      case 'AddDecisionForm':
                        return (
                          <AddDecisionForm
                            onSuccess={hideModal}
                            onSubmit={addDecision}
                          />
                        );
                      case 'RemoveDecisionConfirmation':
                        return (
                          <RemoveDecisionConfirmation
                            id={child.id}
                            title={decisions[child.id].title}
                            onConfirm={removeDecision}
                            closeModal={hideModal}
                          />
                        );
                    }
                  },
                )}
              </Modal>
            </>
          );
        },
      )}
    </section>
  );
};

export default EventPage;
