import React from 'react';
import { Provider } from 'react-redux';
import store from './common/store';
import Loader from './Loader';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Loader />
    </Provider>
  );
};

export default App;
