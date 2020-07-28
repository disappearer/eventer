import { userDataT } from '../features/authentication/userTypes';
import { get, getReturnT, post } from './api';

type fetchUserResponseT = { user: userDataT };
type fetchUserT = () => Promise<getReturnT<fetchUserResponseT>>;
export const fetchUser: fetchUserT = () => get<fetchUserResponseT>('/api/me');

export type tokenDataT = {
  os: string;
  browser: string;
  token: string;
};
type addFirebaseTokenBodyT = {
  data: tokenDataT;
};
type addFirebaseTokenResponseT = { id: number };
type addFirebaseTokenT = (
  data: tokenDataT,
) => Promise<addFirebaseTokenResponseT>;
export const addFirebaseToken: addFirebaseTokenT = async (data) => {
  const event = await post<addFirebaseTokenResponseT, addFirebaseTokenBodyT>(
    '/api/me/firebase_token',
    { data },
  );
  return event;
};
