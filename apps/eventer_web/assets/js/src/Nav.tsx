import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxStateT } from './common/store';
import { userT } from './features/authentication/userReducer';

const Nav: React.FC = () => {
  const user = useSelector<reduxStateT, userT>(({ user }) => user);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {user.data.fold(
          () => (
            <li>
              <a href="/auth/google">Google Login</a>
            </li>
          ),
          () => (
            <li>
              <a href="/auth/logout">Logout</a>
            </li>
          ),
        )}
      </ul>
      {user.data.fold(
        () => null,
        ({ displayName }) => (
          <span id="display-name">Logged in as: {displayName}</span>
        ),
      )}
    </nav>
  );
};

export default Nav;
