import { combineReducers, createStore } from 'redux';
import userReducer, { userT } from '../features/authentication/userReducer';
import eventReducer, { eventT } from '../features/event/eventReducer';
import notificationReducer, {
  notificationsStateT,
} from '../features/notifications/notificationReducer';

export type reduxStateT = {
  user: userT;
  event: eventT;
  notifications: notificationsStateT;
};

const rootReducer = combineReducers<reduxStateT>({
  user: userReducer,
  event: eventReducer,
  notifications: notificationReducer
});

export default createStore(rootReducer);
