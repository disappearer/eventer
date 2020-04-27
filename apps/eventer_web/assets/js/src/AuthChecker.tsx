import React from 'react';
import styled from 'styled-components';
import Loader from './components/Loader';
import useCheckAuthentication from './features/authentication/useCheckAuthentication';
import Router from './Router';

const LoaderWrapper = styled.div`
  padding-top: 100px;
`;

const AuthChecker: React.FC = ({ children }) => {
  const { checking } = useCheckAuthentication();

  return checking ? (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  ) : (
    <>{children}</>
  );
};

export default AuthChecker;
