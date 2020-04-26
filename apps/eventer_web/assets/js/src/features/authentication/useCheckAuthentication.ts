import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import store, { reduxStateT } from '../../common/store';
import { getCookieToken } from '../../util/cookieHelper';
import { fetchUser } from '../../util/userService';
import { setUser } from './userActions';
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
