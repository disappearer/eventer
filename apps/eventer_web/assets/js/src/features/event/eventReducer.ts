import { Reducer } from 'redux';
import { actionT, TOGGLE_CHAT, SET_IS_CHAT_VISIBLE, SET_IS_JOINED } from './eventActions';

export type eventT = {
  isChatVisible: boolean;
  isJoined: boolean;
};

const initialState: eventT = {
  isChatVisible: false,
  isJoined: false
};

const userReducer: Reducer<eventT, actionT> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case TOGGLE_CHAT:
      return { ...state, isChatVisible: !state.isChatVisible };
    case SET_IS_CHAT_VISIBLE:
      const { isChatVisible } = action.payload;
      return { ...state, isChatVisible };
    case SET_IS_JOINED:
      const { isJoined } = action.payload;
      return { ...state, isJoined };
    default:
      return state;
  }
};

export default userReducer;
