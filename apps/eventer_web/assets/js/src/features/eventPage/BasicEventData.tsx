import React from 'react';
import Button from '../../components/Button';
import Description from '../../components/Description';
import { getDateString, getTimeString } from '../../util/time';
import {
  BottomLine,
  CreatedBy,
  EventTitle,
  Grid,
  Info,
  Label,
  Participants,
  ParticipantsGrid,
  Place,
  Span,
  Time,
  TimeData,
} from './BasicEventData.styles';
import { stateEventT } from './types';

type basicEventDataPropsT = {
  event: stateEventT;
  currentUserId: number;
  onEditEventClick: () => void;
  onDiscussTimeClick: () => void;
  onDiscussPlaceClick: () => void;
  joinEvent: () => void;
  leaveEvent: () => void;
};
const BasicEventData: React.FC<basicEventDataPropsT> = ({
  event,
  currentUserId,
  onEditEventClick,
  onDiscussTimeClick,
  onDiscussPlaceClick,
  joinEvent,
  leaveEvent,
}) => {
  const { title, description, time, place, creatorId, participants } = event;
  return (
    <Grid>
      <Info>
        <EventTitle>{title}</EventTitle>
        <Button onClick={onEditEventClick}>Edit</Button>
        <Description>{description}</Description>
        <CreatedBy>Created by {participants[creatorId].displayName}</CreatedBy>
      </Info>
      <Time>
        <Label>Time</Label>
        {time ? (
          <TimeData>
            <div>{getDateString(time)}</div>
            <div>{getTimeString(time)}</div>
          </TimeData>
        ) : (
          <Span>TBD</Span>
        )}
        {time && <Button onClick={onDiscussTimeClick}>Discuss</Button>}
      </Time>
      <Place>
        <Label>Place</Label>
        <Span>{place || 'TBD'}</Span>
        {place && <Button onClick={onDiscussPlaceClick}>Discuss</Button>}
      </Place>
      <Participants>
        <Label>Participants</Label>
        <ParticipantsGrid>
          {Object.entries(participants).map(
            ([participantId, participantData]) => (
              <div key={participantId}>{participantData.displayName}</div>
            ),
          )}
        </ParticipantsGrid>
        {creatorId !== currentUserId && (
          <Button
            onClick={participants[currentUserId] ? leaveEvent : joinEvent}
          >
            {participants[currentUserId] ? 'Leave' : 'Join'}
          </Button>
        )}
      </Participants>
      <BottomLine />
    </Grid>
  );
};

export default BasicEventData;
