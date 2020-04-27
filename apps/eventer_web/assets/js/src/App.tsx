import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import AuthChecker from './AuthChecker';
import store from './common/store';
import theme from './common/theme';
import Router from './Router';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthChecker>
          <Router />
        </AuthChecker>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
