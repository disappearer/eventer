import { Socket } from 'phoenix';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthorizedUser } from '../features/authentication/useAuthorizedUser';
import { Option, None, Some } from 'funfix';

type userT = {
  id: number;
  displayName: string;
  email: string;
};

type decisionT = {
  id: number;
  title: string;
  description: string;
  objective: 'place' | 'time' | 'general';
  pending: boolean;
  creator_id: number;
  resolution: string | null;
};

type eventT = {
  id: number;
  title: string;
  description: string;
  creator: userT;
  place: string | null;
  time: Date | null;
  decisions: decisionT[];
  participants: userT[];
};

const EventPage: React.FC = () => {
  const { token } = useAuthorizedUser();
  const { id_hash } = useParams();
  const [event, setEvent] = useState<Option<eventT>>(None);

  useEffect(() => {
    const socket = new Socket('/socket', { params: { token } });
    socket.connect();

    const channel = socket.channel(`event:${id_hash}`);
    channel
      .join()
      .receive('ok', ({ event }) => setEvent(Some(event)))
      .receive('error', ({ reason }) => console.log('failed join', reason));
  }, []);

  return (
    <section>
      {event.fold(
        () => (
          <div>Loading event data...</div>
        ),
        event => {
          const { title, description, time, place, decisions, creator } = event;
          return (
            <>
              <div className="row">
                <div id="block" className="box">
                  <h1>{title}</h1>
                  <p>{description}</p>
                  <p>Created by {creator.displayName}</p>
                </div>
                <div className="box">
                  <h3>Time</h3>
                  <p>{time || 'TBD'}</p>
                  <h3>Place</h3>
                  <p>{place || 'TBD'}</p>
                </div>
              </div>
              <div>
                <h2>Decisions</h2>
                {decisions.map(
                  ({ id, title, description, pending, objective }) => (
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
            </>
          );
        },
      )}
    </section>
  );
};

export default EventPage;
