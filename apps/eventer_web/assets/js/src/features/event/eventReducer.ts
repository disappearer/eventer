import { Reducer } from 'redux';
import { actionT, TOGGLE_CHAT, SET_IS_CHAT_VISIBLE } from './eventActions';

export type eventT = {
  isChatVisible: boolean;
};

const initialState: eventT = {
  isChatVisible: false,
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
    default:
      return state;
  }
};

export default userReducer;
