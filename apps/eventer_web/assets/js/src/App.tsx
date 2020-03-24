import React from 'react';
import { Provider } from 'react-redux';
import store from './common/store';
import Loader from './Loader';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>

      <Loader />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
