import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import About from './pages/AboutPage';
import EventPage from './pages/EventPage';
import HomePage from './pages/HomePage';
import NewEventPage from './pages/NewEventPage';
import styled from 'styled-components';

const AppWrapper = styled.div`
  height: 100%;

  margin: 0 auto;
  max-width: 800px;
  position: relative;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;

  height: 100%;

  display: flex;
  flex-direction: column;
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
