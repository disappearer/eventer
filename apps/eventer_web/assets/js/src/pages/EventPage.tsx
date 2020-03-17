import { None, Option, Some } from 'funfix';
import React, { useState, useCallback } from 'react';
import Modal from '../components/Modal';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import BasicEventData from '../features/eventPage/BasicEventData';
import Decision from '../features/eventPage/Decision';
import Decisions from '../features/eventPage/Decisions';
import EventUpdateForm from '../features/eventPage/EventUpdateForm';
import useChannel from '../features/eventPage/useChannel';
import useChannelCallbacks from '../features/eventPage/useChannelCallbacks';
import { stateEventT } from '../features/eventPage/util';
import AddDecisionForm from '../features/eventPage/AddDecisionForm';

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

type modalChildT =
  | eventUpdateFormModalChildT
  | addDecisionModalChildT
  | decisionModalChildT;

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
  } = useChannelCallbacks(channel);

  const showEditModal = useCallback(() => {
    setModalChild(Some({ component: 'EventUpdateForm' }));
    setShouldShowModal(true);
  }, [setModalChild, setShouldShowModal]);

  const showAddDecisionModal = useCallback(() => {
    setModalChild(Some({ component: 'AddDecisionForm' }));
    setShouldShowModal(true);
  }, [setModalChild, setShouldShowModal]);

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
                        const { id } = child;
                        return (
                          <Decision
                            id={id}
                            data={decisions[id]}
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
