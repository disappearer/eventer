import React from 'react';
import Button from '../../components/Button';
import Description from '../../components/Description';
import { getDateString, getTimeString } from '../../util/time';
import {
  CreatedBy,
  EventTitle,
  EventTitleLine,
  Grid,
  Info,
  Label,
  Participants,
  ParticipantsGrid,
  Place,
  Span,
  Time,
  TimeData,
} from './BasicEventInfo.styles';
import { stateEventT } from './types';
import useParticipation from './useParticipation';

type basicEventInfoPropsT = {
  event: stateEventT;
  currentUserId: number;
  onEditEventClick: () => void;
  onDiscussTimeClick: () => void;
  onDiscussPlaceClick: () => void;
  joinEvent: () => void;
  leaveEvent: () => void;
};
const BasicEventInfo: React.FC<basicEventInfoPropsT> = ({
  event,
  currentUserId,
  onEditEventClick,
  onDiscussTimeClick,
  onDiscussPlaceClick,
  joinEvent,
  leaveEvent,
}) => {
  const { title, description, time, place, creatorId, participants } = event;
  const isCurrentUserParticipating = useParticipation();
  return (
    <Grid>
      <Info>
        <EventTitleLine>
          <EventTitle>{title}</EventTitle>
          {isCurrentUserParticipating && (
            <Button onClick={onEditEventClick}>Edit</Button>
          )}
        </EventTitleLine>
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
        {isCurrentUserParticipating && time && (
          <Button onClick={onDiscussTimeClick}>Discuss</Button>
        )}
      </Time>
      <Place>
        <Label>Place</Label>
        <Span>{place || 'TBD'}</Span>
        {isCurrentUserParticipating && place && (
          <Button onClick={onDiscussPlaceClick}>Discuss</Button>
        )}
      </Place>
      <Participants>
        <Label>Participants</Label>
        <ParticipantsGrid>
          {Object.entries(participants).map(
            ([participantId, participantData]) => (
              <div key={participantId}>{participantData.displayName}</div>
            ),
          )}
          {creatorId !== currentUserId && (
            <Button
              onClick={participants[currentUserId] ? leaveEvent : joinEvent}
            >
              {participants[currentUserId] ? 'Leave' : 'Join'}
            </Button>
          )}
        </ParticipantsGrid>
      </Participants>
    </Grid>
  );
};

export default BasicEventInfo;
