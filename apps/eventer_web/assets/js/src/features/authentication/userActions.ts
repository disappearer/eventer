import { userDataT } from './userReducer';

export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

type actionTypeT = 'SET_USER' | 'REMOVE_USER';

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT =
  | ack<'SET_USER', { user: userDataT }>
  | ack<'REMOVE_USER', {}>;

type setUserT = (a: userDataT) => actionT;
export const setUser: setUserT = (user: userDataT) => ({ type: SET_USER, payload: { user } });

type removeUserT = () => actionT;
export const removeUser: removeUserT = () => ({ type: REMOVE_USER, payload: {} });
