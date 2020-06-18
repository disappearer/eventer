import React from 'react';
import Description from '../../components/Description';
import { getDateString, getTimeString } from '../../util/time';
import {
  CreatedBy,
  DiscussButton,
  EditEventButton,
  EventTitle,
  EventTitleLine,
  BasicEventInfoWrapper,
  Info,
  Label,
  Participant,
  Participants,
  ParticipantsGrid,
  PlaceData,
  PlaceDiscussButton,
  PlaceLabel,
  PresenceIndicator,
  TimeData,
  TimePlace,
  CreatedByAndParticipationButton,
  ParticipationButton,
} from './BasicEventInfo.styles';
import useParticipation from './hooks/useParticipation';
import { stateEventT } from './types';
import { HorizontalSeparator } from './EventPage.styles';
import Link from '../../components/Link';
import Markdown from '../../components/Markdown';
import ReactTooltip from 'react-tooltip';

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
    <BasicEventInfoWrapper>
      <ReactTooltip />
      <Info>
        <EventTitleLine>
          <EventTitle>
            {title}
            {isCurrentUserParticipating && (
              <EditEventButton
                onClick={onEditEventClick}
                data-tip="Edit event data"
                data-place="bottom"
              />
            )}
          </EventTitle>
        </EventTitleLine>
        {description && (
          <Description>
            <Markdown>{description}</Markdown>
          </Description>
        )}
        <CreatedByAndParticipationButton>
          <CreatedBy>Created by {participants[creatorId].name}</CreatedBy>
          {creatorId !== currentUserId && (
            <ParticipationButton
              onClick={participants[currentUserId] ? leaveEvent : joinEvent}
              action={participants[currentUserId] ? 'leave' : 'join'}
            >
              {participants[currentUserId] ? 'leave' : 'join'}
            </ParticipationButton>
          )}
        </CreatedByAndParticipationButton>
      </Info>
      <HorizontalSeparator />
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
        <PlaceData>
          {(place && <Markdown>{place}</Markdown>) || 'TBD'}
        </PlaceData>
        {isCurrentUserParticipating && place && (
          <PlaceDiscussButton onClick={onDiscussPlaceClick}>
            Discuss
          </PlaceDiscussButton>
        )}
      </TimePlace>
      <HorizontalSeparator />
      <Participants>
        <Label>Participants</Label>
        <ParticipantsGrid>
          {Object.entries(participants).map(
            ([participantId, participantData]) => (
              <Participant key={participantId}>
                <div>
                  <PresenceIndicator isOnline={participantData.isOnline} />
                </div>
                {participantData.name}
              </Participant>
            ),
          )}
        </ParticipantsGrid>
      </Participants>
    </BasicEventInfoWrapper>
  );
};

export default BasicEventInfo;
