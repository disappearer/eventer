import { None, Option, Some } from 'funfix';
import React, { useCallback, useState } from 'react';
import Modal from '../components/Modal';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import AddDecisionForm from '../features/eventPage/AddDecisionForm';
import BasicEventData from '../features/eventPage/BasicEventData';
import Decision from '../features/eventPage/Decision';
import Decisions from '../features/eventPage/Decisions';
import EventUpdateForm from '../features/eventPage/EventUpdateForm';
import OpenDiscussionConfirmation from '../features/eventPage/OpenDiscussionConfirmation';
import RemoveDecisionConfirmation from '../features/eventPage/RemoveDecisionConfirmation';
import { specificObjectiveT, stateEventT } from '../features/eventPage/types';
import useChannel from '../features/eventPage/useChannel';
import useChannelCallbacks from '../features/eventPage/useChannelCallbacks';
import { hasExistingDecision } from '../features/eventPage/util';
import useModal from '../features/eventPage/useModal';

const EventPage: React.FC = () => {
  const { token, id: currentUserId } = useAuthorizedUser();
  const [event, setEvent] = useState<Option<stateEventT>>(None);

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
    discardResolution,
    removeDecision,
    addPoll,
  } = useChannelCallbacks(channel);

  const {
    shouldShowModal,
    modalChild,
    showEditModal,
    showAddDecisionModal,
    showDecisionModal,
    showOpenDiscussionModal,
    showRemoveDecisionModal,
    hideModal,
  } = useModal();

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
                onDiscussTimeClick={() => showOpenDiscussionModal('time')}
                onDiscussPlaceClick={() => showOpenDiscussionModal('place')}
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
                            onResolutionDiscard={discardResolution}
                            onAddPoll={addPoll}
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
                      case 'OpenDiscussionConfirmation':
                        const decisionExists = hasExistingDecision(
                          decisions,
                          child.objective,
                        );
                        return (
                          <OpenDiscussionConfirmation
                            objective={child.objective}
                            hasCorrespondingDecision={decisionExists}
                            onConfirm={
                              child.objective === 'time'
                                ? openTimeDiscussion
                                : openPlaceDiscussion
                            }
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
