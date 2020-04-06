import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import store from './common/store';
import RouterWithAuthCheck from './RouterWithAuthCheck';
import theme from './theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterWithAuthCheck />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
