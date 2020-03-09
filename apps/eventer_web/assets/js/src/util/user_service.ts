import { getCookieToken } from './cookie_helper';
import store from '../common/store';
import { setUser } from '../features/authentication/userActions';
import { get } from './api';
import { userDataT } from '../features/authentication/userReducer';

export const fetchUserIfAuthenticated = async () => {
  const token = getCookieToken();
  if (token) {
    const { user } = await get<{ user: userDataT }>('/api/me');
    store.dispatch(setUser(user));
  }
};
