import { applyMiddleware, combineReducers, createStore } from 'redux';
import userReducer, { userT } from '../features/authentication/userReducer';
import logger from 'redux-logger';

export type reduxStateT = {
  user: userT;
};

const rootReducer = combineReducers<reduxStateT>({
  user: userReducer,
});

export default createStore(rootReducer);
