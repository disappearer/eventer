import { Socket, Channel } from 'phoenix';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import { Option, None, Some } from 'funfix';
import {
  stateEventT,
  mapResponseEventToStateEvent,
  addUserToParticipants,
  moveToExParticipants,
  updateStateEvent,
} from '../features/eventPage/util';
import Modal from '../components/Modal';
import EventUpdateForm, { updateEventT } from '../features/eventPage/EventUpdateForm';

type modalFormT = 'update';

const EventPage: React.FC = () => {
  const { token, id: currentUserId } = useAuthorizedUser();
  const { id_hash } = useParams();
  const [event, setEvent] = useState<Option<stateEventT>>(None);
  const [channel, setChannel] = useState<Option<Channel>>(None);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalForm, setModalForm] = useState<Option<modalFormT>>(None);

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

  const updateEvent = useCallback<updateEventT>((data) => {
    channel.get().push('update_event', {event: data})
  }, [channel])

  const showEditModal = () => {
    setModalForm(Some('update'));
    setShouldShowModal(true);
  };

  const hideEditModal = () => {
    setModalForm(None);
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
                  <h3>Place</h3>
                  <p>{place || 'TBD'}</p>
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
                {Object.entries(decisions).map(
                  ([id, { title, description, pending, objective }]) => (
                    <div key={id} className="decision row">
                      <div className="decision-section">
                        <h3>
                          {title}
                          {pending && ' (pending)'}
                        </h3>
                        <p>{description}</p>
                      </div>
                      <div className="decision-section">
                        <p>Objective: {objective}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <Modal
                shouldShowModal={shouldShowModal}
                hideModal={hideEditModal}
              >
                {modalForm.fold(
                  () => null,
                  modalForm => {
                    switch (modalForm) {
                      case 'update':
                        return (
                          <EventUpdateForm
                            initialValues={{ title, description }}
                            onSuccess={hideEditModal}
                            onSubmit={updateEvent}
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
