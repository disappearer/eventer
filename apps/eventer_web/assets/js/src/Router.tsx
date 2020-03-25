import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import About from './pages/AboutPage';
import EventPage from './pages/EventPage';
import HomePage from './pages/HomePage';
import NewEventPage from './pages/NewEventPage';
import styled from 'styled-components';

const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: 100%;

  @media (max-width: 620px) {
    grid-template-columns: auto;
  }
`;

const Content = styled.div`
  grid-column: 2/3;
  padding: 10px 30px;

  @media (max-width: 620px) {
    grid-column: 1/2;
  }
`;

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Content>
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
        </Content>
      </AppWrapper>
    </BrowserRouter>
  );
};

export default Router;
