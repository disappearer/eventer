import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

export type navigateT = (path: string) => void;

type useNavigationT = () => {
  navigate: navigateT;
};
export const useNavigation: useNavigationT = () => {
  let history = useHistory();

  const navigate = useCallback<navigateT>(
    (path) => {
      history.push(path);
    },
    [history],
  );

  return { navigate };
};
