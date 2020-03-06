import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Nav from './Nav';
import About from './About';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Nav />

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Router;
