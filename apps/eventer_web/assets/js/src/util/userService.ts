import { userDataT } from '../features/authentication/userReducer';
import { get, getReturnT } from './api';

type fetchUserResponseT = { user: userDataT };

type fetchUserT = () => Promise<getReturnT<fetchUserResponseT>>;
export const fetchUser: fetchUserT = () => {
  return get<fetchUserResponseT>('/api/me');
};
