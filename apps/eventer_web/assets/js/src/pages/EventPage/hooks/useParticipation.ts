import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../../../common/store';
import { userT } from '../../../features/authentication/userReducer';
import EventContext from '../EventContext';

type useParticipationT = () => boolean;
const useParticipation: useParticipationT = () => {
  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  const { event } = useContext(EventContext);
  return event.participants[user.data.get().id] !== undefined;
};

export default useParticipation;
