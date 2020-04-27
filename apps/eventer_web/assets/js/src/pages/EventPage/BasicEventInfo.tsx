import React from 'react';
import Button from '../../components/Button';
import Description from '../../components/Description';
import { getDateString, getTimeString } from '../../util/time';
import {
  CreatedBy,
  DiscussButton,
  EditEventButton,
  EventTitle,
  EventTitleLine,
  Grid,
  Info,
  Label,
  Participants,
  ParticipantsGrid,
  PlaceData,
  PlaceDiscussButton,
  PlaceLabel,
  TimeData,
  TimePlace,
} from './BasicEventInfo.styles';
import { stateEventT } from './types';
import useParticipation from './hooks/useParticipation';

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
            <EditEventButton onClick={onEditEventClick}>
              Edit basic info
            </EditEventButton>
          )}
        </EventTitleLine>
        <Description>{description}</Description>
        <CreatedBy>Created by {participants[creatorId].name}</CreatedBy>
      </Info>
      <TimePlace>
        <Label>Time</Label>
        {time ? (
          <TimeData>
            <div>{getDateString(time)}</div>
            <div>{getTimeString(time)}</div>
          </TimeData>
        ) : (
          <TimeData>TBD</TimeData>
        )}
        {isCurrentUserParticipating && time && (
          <DiscussButton onClick={onDiscussTimeClick}>Discuss</DiscussButton>
        )}
        <PlaceLabel>Place</PlaceLabel>
        <PlaceData>{place || 'TBD'}</PlaceData>
        {isCurrentUserParticipating && place && (
          <PlaceDiscussButton onClick={onDiscussPlaceClick}>
            Discuss
          </PlaceDiscussButton>
        )}
      </TimePlace>
      <Participants>
        <Label>Participants</Label>
        <ParticipantsGrid>
          {Object.entries(participants).map(
            ([participantId, participantData]) => (
              <div key={participantId}>{participantData.name}</div>
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
