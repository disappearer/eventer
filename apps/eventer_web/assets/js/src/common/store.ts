import { combineReducers, createStore } from 'redux';
import userReducer, { userT } from '../features/authentication/userReducer';
import eventReducer, { eventT } from '../features/eventPage/eventReducer';

export type reduxStateT = {
  user: userT;
  event: eventT;
};

const rootReducer = combineReducers<reduxStateT>({
  user: userReducer,
  event: eventReducer,
});

export default createStore(rootReducer);
