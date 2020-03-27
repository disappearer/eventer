import { None, Option } from 'funfix';
import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import AddDecisionForm from '../features/eventPage/AddDecisionForm';
import BasicEventInfo from '../features/eventPage/BasicEventInfo';
import Chat from '../features/eventPage/Chat';
import DecisionDetails from '../features/eventPage/DecisionDetails';
import Decisions from '../features/eventPage/Decisions';
import {
  DecisionsAndChat,
  EventPageWrapper,
  HorizontalSeparator,
  VerticalSeparator,
} from '../features/eventPage/EventPage.styles';
import EventUpdateForm from '../features/eventPage/EventUpdateForm';
import OpenDiscussionConfirmation from '../features/eventPage/OpenDiscussionConfirmation';
import RemoveDecisionConfirmation from '../features/eventPage/RemoveDecisionConfirmation';
import { stateEventT } from '../features/eventPage/types';
import useChannel from '../features/eventPage/useChannel';
import useChannelCallbacks from '../features/eventPage/useChannelCallbacks';
import useModal from '../features/eventPage/useModal';
import { hasExistingDecision } from '../features/eventPage/util';

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

  return event.fold(
    () => <div>Loading event data...</div>,
    event => {
      const { title, description, decisions } = event;
      return (
        <EventPageWrapper>
          <HorizontalSeparator />
          <BasicEventInfo
            event={event}
            currentUserId={currentUserId}
            onEditEventClick={showEditModal}
            onDiscussTimeClick={() => showOpenDiscussionModal('time')}
            onDiscussPlaceClick={() => showOpenDiscussionModal('place')}
            joinEvent={joinEvent}
            leaveEvent={leaveEvent}
          />
          <HorizontalSeparator />
          <DecisionsAndChat>
            <Decisions
              decisions={decisions}
              onDecisionClick={showDecisionModal}
              onAddDecisionClick={showAddDecisionModal}
              onRemoveDecisionClick={showRemoveDecisionModal}
            />
            <VerticalSeparator />
            <Chat />
          </DecisionsAndChat>

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
                      <DecisionDetails
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
        </EventPageWrapper>
      );
    },
  );
};

export default EventPage;
