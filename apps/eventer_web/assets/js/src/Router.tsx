import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import About from './pages/About';
import Home from './pages/Home';
import NewEvent from './pages/NewEvent';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Nav />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/event/new">
            <NewEvent />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Router;
