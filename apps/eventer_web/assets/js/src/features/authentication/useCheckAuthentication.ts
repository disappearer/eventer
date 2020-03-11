import { useEffect, useState } from 'react';
import store, { reduxStateT } from '../../common/store';
import { getCookieToken } from '../../util/cookie_helper';
import { fetchUser } from '../../util/user_service';
import { setUser } from './userActions';
import { useSelector } from 'react-redux';
import { userT } from './userReducer';

type useCheckAuthenticationT = () => { checking: boolean };
const useCheckAuthentication: useCheckAuthenticationT = () => {
  const [checking, setChecking] = useState(true);
  const user = useSelector<reduxStateT, userT>(({ user }) => user);

  useEffect(() => {
    const checkAndSetUser = async () => {
      const token = getCookieToken();
      if (token) {
        const user = await fetchUser();
        store.dispatch(setUser({ ...user, token }));
      } else {
        setChecking(false);
      }
    };

    checkAndSetUser();
  }, []);

  useEffect(() => {
    if (!user.data.isEmpty()) {
      setChecking(false);
    }
  }, [user]);

  return { checking };
};

export default useCheckAuthentication;
