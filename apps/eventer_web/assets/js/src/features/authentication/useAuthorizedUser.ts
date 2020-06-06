import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxStateT } from '../../common/store';
import { userT, userDataT } from './userReducer';
import { setRedirectCookie } from '../../util/cookieHelper';

const dummyUserData: userDataT = {
  id: -1,
  email: '',
  name: '',
  image: '',
  token: '',
};

export const useAuthorizedUser = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  if (user.data.isEmpty()) {
    setRedirectCookie(pathname);
    history.push('/login');
  }


  return user.data.fold(
    () => dummyUserData,
    (data) => data,
  );
};
