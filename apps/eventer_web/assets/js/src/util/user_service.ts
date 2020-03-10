import { userDataT } from '../features/authentication/userReducer';
import { get } from './api';

type fetchUserT = () => Promise<userDataT>;
export const fetchUser: fetchUserT = async () => {
  const { user } = await get<{ user: userDataT }>('/api/me');
  return user;
};
