import { FC } from 'react';
import { useFirebase } from './util/firebase';
import useTabFocus from './features/notifications/useTabFocus';

const GlobalHooks: FC = () => {
  useTabFocus();
  useFirebase();

  return null;
};

export default GlobalHooks;
