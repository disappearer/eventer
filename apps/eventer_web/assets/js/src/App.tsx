import React from 'react';
import { Provider } from 'react-redux';
import store from './common/store';
import useCheckAuthentication from './features/authentication/useCheckAuthentication';
import Router from './Router';

const App: React.FC = () => {
  useCheckAuthentication(); 

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
