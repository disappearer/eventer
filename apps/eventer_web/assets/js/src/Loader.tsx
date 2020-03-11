import React from 'react';
import useCheckAuthentication from './features/authentication/useCheckAuthentication';
import Router from './Router';

const Loader: React.FC = () => {
  const { checking } = useCheckAuthentication();

  return checking ? <div>Loading...</div> : <Router />;
};

export default Loader;
