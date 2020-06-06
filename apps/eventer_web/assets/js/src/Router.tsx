import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './Layout';
import Nav from './Nav';
import About from './pages/AboutPage';
import EventPage from './pages/EventPage/EventPage';
import HomePage from './pages/HomePage/HomePage';
import NewEventPage from './pages/NewEventPage/NewEventPage';
import GlobalHooks from './GlobalHooks';
import LoginPage from './pages/LoginPage/LoginPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalHooks />
      <Layout>
        <Nav />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
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
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
