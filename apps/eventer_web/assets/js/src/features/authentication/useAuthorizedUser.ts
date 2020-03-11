import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../../common/store';
import { userT, userDataT } from './userReducer';

const dummyUserData: userDataT = {
  email: '',
  displayName: '',
  token: '',
};

export const useAuthorizedUser = () => {
  const history = useHistory();
  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  if (user.data.isEmpty()) {
    history.push('/');
  }

  return user.data.fold(
    () => dummyUserData,
    data => data,
  );
};
