import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { reduxStateT } from './common/store';
import Link from './components/Link';
import { userT } from './features/authentication/userReducer';

const Navbar = styled.nav`
  display: grid;
  padding: 10px;
  grid-row-gap: 20px;
  grid-template-columns: repeat(2, minmax(auto, 350px));
  justify-content: center;
  align-items: center;
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    justify-items: center;
    order: -1;
  }
`;

const NavList = styled.div`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: end;
`;

const NavListItem = styled.div`
  display: inline-block;
  margin: 0 10px;
`;

const User = styled(NavListItem)`
  display: grid;
  grid-template-columns: auto 1fr;
  @media (max-width: 620px) {
    order: -1;
  }
`;

const Nav: React.FC = () => {
  const user = useSelector<reduxStateT, userT>(({ user }) => user);

  return (
    <Navbar>
      <NavList>
        <NavListItem>
          <Link to="/">Home</Link>
        </NavListItem>
        <NavListItem>
          <Link to="/about">About</Link>
        </NavListItem>
        {!user.data.isEmpty() && (
          <NavListItem>
            <Link to="/events/new">New Event</Link>
          </NavListItem>
        )}
      </NavList>
      <User>
        {user.data.fold(
          () => null,
          ({ displayName }) => (
            <NavListItem id="display-name">{displayName}</NavListItem>
          ),
        )}
        {user.data.fold(
          () => (
            <NavListItem>
              <Link external={true} asButton={true} to="/auth/google">
                Google Login
              </Link>
            </NavListItem>
          ),
          () => (
            <NavListItem>
              <Link external={true} asButton={true} to="/auth/logout">
                Logout
              </Link>
            </NavListItem>
          ),
        )}
      </User>
    </Navbar>
  );
};

export default Nav;
