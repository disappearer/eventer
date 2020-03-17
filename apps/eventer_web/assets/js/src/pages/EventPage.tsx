import { None, Option, Some } from 'funfix';
import { Channel, Socket } from 'phoenix';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import Decision from '../features/eventPage/Decision';
import { resolveDecisionT } from '../features/eventPage/DecisionResolveForm';
import { updateDecisionT } from '../features/eventPage/DecisionUpdateForm';
import EventUpdateForm, {
  updateEventT,
} from '../features/eventPage/EventUpdateForm';
import {
  addUserToParticipants,
  mapResponseEventToStateEvent,
  moveToExParticipants,
  openStateDiscussion,
  resolveStateDecision,
  stateEventT,
  updateStateDecision,
  updateStateEvent,
} from '../features/eventPage/util';

type eventUpdateFormModalChildT = {
  component: 'EventUpdateForm';
  props: {};
};

type decisionModalChildT = {
  component: 'Decision';
  id: number;
};

type modalChildT = eventUpdateFormModalChildT | decisionModalChildT;

const EventPage: React.FC = () => {
  const { token, id: currentUserId } = useAuthorizedUser();
  const { id_hash } = useParams();
  const [event, setEvent] = useState<Option<stateEventT>>(None);
  const [channel, setChannel] = useState<Option<Channel>>(None);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalChild, setModalChild] = useState<Option<modalChildT>>(None);

  useEffect(() => {
    const socket = new Socket('/socket', { params: { token } });
    socket.connect();

    const channel = socket.channel(`event:${id_hash}`);
    channel
      .join()
      .receive('ok', ({ event }) => {
        const stateEvent = mapResponseEventToStateEvent(event);
        setEvent(Some(stateEvent));
      })
      .receive('error', ({ reason }) => console.log('failed join', reason));

    channel.on('user_joined', ({ user }) => {
      setEvent(event => {
        const e = event.get();
        return Some(addUserToParticipants(e, user));
      });
    });

    channel.on('user_left', ({ userId }) => {
      setEvent(event => {
        const e = event.get();
        return Some(moveToExParticipants(e, userId));
      });
    });

    channel.on('event_updated', ({ event: data }) => {
      setEvent(event => {
        const e = event.get();
        return Some(updateStateEvent(e, data));
      });
    });

    channel.on('decision_updated', ({ decision }) => {
      setEvent(event => {
        const e = event.get();
        return Some(updateStateDecision(e, decision));
      });
    });

    channel.on('decision_resolved', ({ decision }) => {
      setEvent(event => {
        const e = event.get();
        return Some(resolveStateDecision(e, decision));
      });
    });

    channel.on('discussion_opened', data => {
      setEvent(event => {
        const e = event.get();
        return Some(openStateDiscussion(e, data));
      });
    });

    setChannel(Some(channel));

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinEvent = useCallback(() => {
    channel.get().push('join_event', {});
  }, [channel]);

  const leaveEvent = useCallback(() => {
    channel.get().push('leave_event', {});
  }, [channel]);

  const updateEvent = useCallback<updateEventT>(
    data => {
      channel.get().push('update_event', { event: data });
    },
    [channel],
  );

  const updateDecision = useCallback<updateDecisionT>(
    data => {
      channel.get().push('update_decision', { decision: data });
    },
    [channel],
  );

  const openTimeDiscussion = useCallback(() => {
    channel.get().push('open_discussion', { objective: 'time' });
  }, [channel]);

  const openPlaceDiscussion = useCallback(() => {
    channel.get().push('open_discussion', { objective: 'place' });
  }, [channel]);

  const resolveDecision = useCallback<resolveDecisionT>(
    (id, resolution) => {
      channel.get().push('resolve_decision', { decision: { id, resolution } });
    },
    [channel],
  );

  const showEditModal = () => {
    setModalChild(Some({ component: 'EventUpdateForm', props: {} }));
    setShouldShowModal(true);
  };

  const showDecisionModal = (id: number) => {
    setModalChild(Some({ component: 'Decision', id }));
    setShouldShowModal(true);
  };

  const hideModal = () => {
    setModalChild(None);
    setShouldShowModal(false);
  };

  return (
    <section>
      {event.fold(
        () => (
          <div>Loading event data...</div>
        ),
        event => {
          const {
            title,
            description,
            time,
            place,
            decisions,
            creatorId,
            participants,
          } = event;
          return (
            <>
              <div className="row">
                <div id="block" className="box">
                  <h1>{title}</h1>
                  <p>{description}</p>
                  <p>Created by {participants[creatorId].displayName}</p>
                  <button onClick={showEditModal}>Edit</button>
                </div>
                <div className="box">
                  <h3>Time</h3>
                  <p>{time || 'TBD'}</p>
                  {time && (
                    <button onClick={openTimeDiscussion}>Discuss</button>
                  )}
                  <h3>Place</h3>
                  <p>{place || 'TBD'}</p>
                  {place && (
                    <button onClick={openPlaceDiscussion}>Discuss</button>
                  )}
                </div>
                <div className="box">
                  <h3>Participants</h3>
                  <ul>
                    {Object.entries(participants).map(
                      ([participantId, participantData]) => (
                        <li key={participantId}>
                          {participantData.displayName}
                        </li>
                      ),
                    )}
                  </ul>
                  {creatorId !== currentUserId && (
                    <button
                      onClick={
                        participants[currentUserId] ? leaveEvent : joinEvent
                      }
                    >
                      {participants[currentUserId] ? 'Leave' : 'Join'}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <h2>Decisions</h2>
                {Object.entries(decisions).map(([id, data]) => {
                  const { title, description, pending, objective } = data;
                  return (
                    <div key={id} className="decision row">
                      <div className="decision-section">
                        <h3
                          className="decision-title"
                          onClick={() => showDecisionModal(parseInt(id, 10))}
                        >
                          {title}
                          {pending && ' (pending)'}
                        </h3>
                        <p>{description}</p>
                      </div>
                      <div className="decision-section">
                        <p>Objective: {objective}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
