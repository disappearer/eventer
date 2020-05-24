import { FC } from 'react';
import { useFirebase } from './util/firebase';

const GlobalHooks: FC = () => {
  useFirebase();

  return null;
};

export default GlobalHooks;
