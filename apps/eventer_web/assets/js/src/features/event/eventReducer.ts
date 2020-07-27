import { Reducer } from 'redux';
import {
  actionT,
  TOGGLE_CHAT,
  SET_IS_CHAT_VISIBLE,
  SET_IS_CHANNEL_JOINED,
} from './eventActions';

export type eventT = {
  isChatVisible: boolean;
  isChannelJoined: boolean;
};

const initialState: eventT = {
  isChatVisible: false,
  isChannelJoined: false,
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
    case SET_IS_CHANNEL_JOINED:
      const { isChannelJoined } = action.payload;
      return { ...state, isChannelJoined };
    default:
      return state;
  }
};

export default userReducer;
