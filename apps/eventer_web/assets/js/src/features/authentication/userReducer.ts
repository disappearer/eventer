import { Reducer } from 'redux';
import { actionT, SET_USER, REMOVE_USER } from './userActions';
import { Option, None, Some } from 'funfix';

export type userDataT = {
  email: string;
  displayName: string;
};

export type userT = {
  data: Option<userDataT>;
}

const initialState: userT = {
  data: None,
};

const userReducer: Reducer<userT, actionT> = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, data: Some(action.payload.user) };
    case REMOVE_USER:
      return {
        ...state,
        data: None,
      };
    default:
      return state;
  }
};

export default userReducer;
