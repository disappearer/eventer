import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Router from './Router';
import store from './common/store';
import { fetchUserIfAuthenticated } from './util/user_service';

const App: React.FC = () => {
  useEffect(() => {
    fetchUserIfAuthenticated();
  }, []);

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
