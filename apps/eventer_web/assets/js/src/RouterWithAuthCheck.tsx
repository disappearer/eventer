import React from 'react';
import styled from 'styled-components';
import Loader from './components/Loader';
import useCheckAuthentication from './features/authentication/useCheckAuthentication';
import Router from './Router';

const LoaderWrapper = styled.div`
  padding-top: 100px;
`;

const RouterWithAuthCheck: React.FC = () => {
  const { checking } = useCheckAuthentication();

  return checking ? (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  ) : (
    <Router />
  );
};

export default RouterWithAuthCheck;
