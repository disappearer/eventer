import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { reduxStateT } from '../../common/store';
import { clearRedirectCookie, getRedirectCookie } from '../../util/cookieHelper';
import { userT } from './userReducer';

export const useCheckRedirect = () => {
  const history = useHistory();

  const user = useSelector<reduxStateT, userT>(({ user }) => user);
  if (!user.data.isEmpty()) {
    const path = getRedirectCookie();
    if (path) {
      clearRedirectCookie();
      history.push(path);
    }
  }
};
