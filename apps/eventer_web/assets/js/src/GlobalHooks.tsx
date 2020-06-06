import { FC } from 'react';
import { useFirebase } from './util/firebase';
import useTabFocus from './features/notifications/useTabFocus';
import { useCheckRedirect } from './features/authentication/useCheckRedirect';

const GlobalHooks: FC = () => {
  useTabFocus();
  useFirebase();
  useCheckRedirect();

  return null;
};

export default GlobalHooks;
