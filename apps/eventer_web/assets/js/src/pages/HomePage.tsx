import React from 'react';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../common/store';
import { userT } from '../features/authentication/userReducer';
import EventList from '../features/homePage/EventList';
import Welcome from '../features/homePage/Welcome';

const HomePage: React.FC = () => {
  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  return user.data.fold(
    () => <Welcome />,
    () => <EventList />,
  );
};

export default HomePage;
