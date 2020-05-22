import React from 'react';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../../common/store';
import { userT } from '../../features/authentication/userReducer';
import EventList from './EventList';
import Welcome from './Welcome';
import { useFirebase } from '../../util/firebase';

const HomePage: React.FC = () => {
  useFirebase();

  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  return user.data.fold(
    () => <Welcome />,
    () => <EventList />,
  );
};

export default HomePage;
