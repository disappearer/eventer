import { useEffect } from 'react';
import store from '../../common/store';
import { getCookieToken } from '../../util/cookie_helper';
import { fetchUser } from '../../util/user_service';
import { setUser } from './userActions';

const checkAndSetUser = async () => {
  const token = getCookieToken();
  if (token) {
    const user = await fetchUser();
    store.dispatch(setUser(user));
  }
};

const useCheckAuthentication = () => {
  useEffect(() => {
    checkAndSetUser();
  }, []);
};

export default useCheckAuthentication;
