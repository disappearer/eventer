import React from 'react';
import { stateEventT } from './stateTransformations';

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
  leaveEvent
}) => {
  const { title, description, time, place, creatorId, participants } = event;
  return (
    <div className="row">
      <div id="block" className="box">
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Created by {participants[creatorId].displayName}</p>
        <button onClick={onEditEventClick}>Edit</button>
      </div>
      <div className="box">
        <h3>Time</h3>
        <p>{time || 'TBD'}</p>
        {time && <button onClick={onDiscussTimeClick}>Discuss</button>}
        <h3>Place</h3>
        <p>{place || 'TBD'}</p>
        {place && <button onClick={onDiscussPlaceClick}>Discuss</button>}
      </div>
      <div className="box">
        <h3>Participants</h3>
        <ul>
          {Object.entries(participants).map(
            ([participantId, participantData]) => (
              <li key={participantId}>{participantData.displayName}</li>
            ),
          )}
        </ul>
        {creatorId !== currentUserId && (
          <button
            onClick={participants[currentUserId] ? leaveEvent : joinEvent}
          >
            {participants[currentUserId] ? 'Leave' : 'Join'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BasicEventData;
