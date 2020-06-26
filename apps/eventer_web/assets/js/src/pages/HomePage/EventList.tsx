import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Description from '../../components/Description';
import Link from '../../components/Link';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import Top from '../../components/Top';
import { eventT, getEvents } from '../../util/eventService';
import { formatTime } from '../../util/time';

const Events = styled.div``;

const LoaderWrapper = styled.div`
  padding-top: 100px;
`;

const Event = styled.div`
  padding: 15px 0px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-column-gap: 20px;
`;

const EventTitle = styled.h2`
  justify-self: center;
`;

const TimePlace = styled.div`
  align-self: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 5px;
`;

const Label = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
  letter-spacing: 0.05rem;
  font-variant: small-caps;
  color: ${({ theme }) => theme.colors.emperor};
`;

const TimePlaceItem = styled.div``;

const EventList: React.FC = () => {
  const { events, loadingEvents } = useEvents();

  return (
    <>
      <Top>
        <Title>Your events</Title>
        <Description>
          These are the events of which you are the creator or a participant.
        </Description>
      </Top>
      <Events>
        {loadingEvents ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : (
          events.map((event) => (
            <Event key={event.id_hash}>
              <EventTitle>
                <Link to={`/events/${event.id_hash}`}>{event.title}</Link>
              </EventTitle>
              <TimePlace>
                <TimePlaceItem>
                  <Label>time:</Label>
                  {event.time ? formatTime(event.time) : 'TBD'}
                </TimePlaceItem>
                <TimePlaceItem>
                  <Label>place:</Label>
                  {event.place || 'TBD'}
                </TimePlaceItem>
              </TimePlace>
            </Event>
          ))
        )}
      </Events>
    </>
  );
};

export default EventList;

type useEventsT = () => { events: eventT[]; loadingEvents: boolean };
const useEvents: useEventsT = () => {
  const [events, setEvents] = useState<eventT[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      const result = await getEvents();
      setLoadingEvents(false);
      if (result.ok) {
        setEvents(result.data.events);
      }
    };

    fetchAndSetEvents();
  }, []);

  return { events, loadingEvents };
};
