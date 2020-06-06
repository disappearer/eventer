import { None, Option } from 'funfix';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../../common/store';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useAuthorizedUser } from '../../features/authentication/useAuthorizedUser';
import BasicEventInfo from './BasicEventInfo';
import Chat from './Chat/Chat';
import AddDecisionForm from './Decisions/AddDecisionForm';
import DecisionDetails from './Decisions/DecisionDetails/DecisionDetails';
import Decisions from './Decisions/Decisions';
import RemoveDecisionConfirmation from './Decisions/RemoveDecisionConfirmation';
import EventContext from './EventContext';
import {
  ChatWrapper,
  DecisionsAndChat,
  EventPageWrapper,
  EventPanel,
  HorizontalSeparator,
  LoaderWrapper,
  VerticalSeparator,
} from './EventPage.styles';
import EventUpdateForm from './EventUpdateForm';
import useChannel from './hooks/useChannel';
import useChannelCallbacks from './hooks/useChannelCallbacks';
import useChatHidingBreakpoint from './hooks/useChatHidingBreakpoint';
import useModal from './hooks/useModal';
import usePreviousEvent from './hooks/usePreviousEvent';
import OpenDiscussionConfirmation from './OpenDiscussionConfirmation';
import { stateEventT } from './types';
import { hasExistingDecision } from './util';

const EventPage: React.FC = () => {
  const { token, id: currentUserId } = useAuthorizedUser();
  const [event, setEvent] = useState<Option<stateEventT>>(None);
  const previousEvent = usePreviousEvent(event);

  const { channel } = useChannel(token, setEvent);

  const {
    joinEvent,
    leaveEvent,
    updateEvent,
    addDecision,
    updateDecision,
    openDiscussion,
    resolveDecision,
    discardResolution,
    discardPoll,
    removeDecision,
    addPoll,
    vote,
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

  const isScreenWide = useChatHidingBreakpoint();

  const isChatVisible = useSelector<reduxStateT, boolean>(
    ({ event: { isChatVisible } }) => isChatVisible,
  );

  return event.fold(
    () => (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    ),
    (event) => {
      const { title, description, decisions } = event;
      return (
        <EventContext.Provider value={{ event, previousEvent }}>
          <EventPageWrapper>
            <HorizontalSeparator />
            <ChatWrapper visible={isChatVisible}>
              <Chat
                visible={!isScreenWide && isChatVisible}
                isFullWidthChat={false}
                channel={channel}
              />
            </ChatWrapper>
            <EventPanel visible={!isChatVisible}>
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
                <Chat
                  isFullWidthChat={true}
                  visible={isScreenWide}
                  channel={channel}
                />
              </DecisionsAndChat>

              <Modal shouldShowModal={shouldShowModal} hideModal={hideModal}>
                {modalChild.fold(
                  () => null,
                  (child) => {
                    switch (child.component) {
                      case 'EventUpdateForm':
                        return (
                          <EventUpdateForm
                            initialValues={{
                              title,
                              description: description || '',
                            }}
                            onSuccess={hideModal}
                            onSubmit={updateEvent}
                            formTitle={`Edit ${event.title}`}
                          />
                        );
                      case 'DecisionDetails':
                        return (
                          <DecisionDetails
                            id={child.id}
                            onDecisionResolve={resolveDecision}
                            onDecisionUpdate={updateDecision}
                            onResolutionDiscard={discardResolution}
                            onPollDiscard={discardPoll}
                            onAddPoll={addPoll}
                            onVote={vote}
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
                            onConfirm={openDiscussion}
                            closeModal={hideModal}
                          />
                        );
                    }
                  },
                )}
              </Modal>
            </EventPanel>
          </EventPageWrapper>
        </EventContext.Provider>
      );
    },
  );
};

export default EventPage;
