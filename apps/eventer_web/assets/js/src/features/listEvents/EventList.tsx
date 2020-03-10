import React, { useState, useEffect } from 'react';
import { getEvents, eventT } from '../../util/event_service';
import { Link } from 'react-router-dom';

const EventList: React.FC = () => {
  const { events } = useEvents();

  return (
    <section>
      <div className="row">
        <div id="block" className="box">
          <h1>Your events</h1>
          <p>Organize events with your friends</p>
        </div>
        <div className="box">
          <h2>This is what you need</h2>
        </div>
      </div>
      <div>
        <div id="event-list">
          {events.map(event => (
            <div key={event.id_hash} className="event">
              <Link to={`/events/${event.id_hash}`}>
                <h3>{event.title}</h3>
              </Link>
              <p>Time: {event.time || 'TBD'}</p>
              <p>Place: {event.place || 'TBD'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventList;

type useEventsT = () => { events: eventT[] };
const useEvents: useEventsT = () => {
  const [events, setEvents] = useState<eventT[]>([]);

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      const { events: eventsGot } = await getEvents();
      setEvents(eventsGot);
    };

    fetchAndSetEvents();
  }, []);

  return { events };
};
