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
        const result = await fetchUser();
        switch (result.ok) {
          case true:
            store.dispatch(setUser({ ...result.data.user, token }));
          default:
            setChecking(false);
        }
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
