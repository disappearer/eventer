import { Reducer } from 'redux';
import { actionT, SET_IS_TAB_FOCUSED } from './notificationActions';

export type notificationsStateT = {
  isTabFocused: boolean;
};

const initialState: notificationsStateT = {
  isTabFocused: false,
};

const notificationReducer: Reducer<notificationsStateT, actionT> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case SET_IS_TAB_FOCUSED: {
      const { isTabFocused } = action.payload;
      return { ...state, isTabFocused };
    }
    default:
      return state;
  }
};

export default notificationReducer;
