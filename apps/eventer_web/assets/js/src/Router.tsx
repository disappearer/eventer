import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import About from './pages/AboutPage';
import EventPage from './pages/EventPage';
import HomePage from './pages/HomePage';
import NewEventPage from './pages/NewEventPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Nav />

        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/events/new">
            <NewEventPage />
          </Route>
          <Route path="/events/:id_hash">
            <EventPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Router;
