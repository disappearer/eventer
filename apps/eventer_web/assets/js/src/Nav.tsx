import React, { useContext, useEffect, useState } from 'react';
import HamburgerMenu from 'react-hamburger-menu';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { reduxStateT } from './common/store';
import Button from './components/Button';
import Link from './components/Link';
import { userT } from './features/authentication/userReducer';
import { setIsChatVisible, toggleChat } from './features/event/eventActions';
import { CHAT_HIDING_BREAKPOINT } from './pages/EventPage/Chat/Chat.util';
import ExternalLink from './components/ExternalLink';

type navbarPropsT = {
  visible: boolean;
};
const Navbar = styled.nav<navbarPropsT>`
  flex: none;
  display: grid;
  grid-row-gap: 15px;
  grid-template-columns: repeat(2, minmax(auto, 350px));
  justify-content: center;
  align-items: center;
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${(props) => (props.visible ? 'grid' : 'none')};
  }

  font-size: 0.9rem;
  letter-spacing: 0.05rem;
`;

const NavList = styled.div`
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

const UserName = styled(NavListItem)`
  font-weight: 300;
  letter-spacing: 0.05rem;
`;

const NavbarNarrow = styled.nav<navbarPropsT>`
  display: none;
  grid-template-columns: 1fr;
  align-items: center;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: ${(props) => (props.visible ? 'grid' : 'none')};
  }
`;

const Harbungen = styled.div`
  display: none;
  position: absolute !important;
  z-index: 42;
  top: 17px;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    display: block;
  }
`;

const ChatToggleButton = styled(Button)`
  justify-self: end;
  line-height: 1.1;
  padding: 7px;
  font-size: 0.9rem;
  outline: 0;
`;

const Nav: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const match = useRouteMatch<{ id_hash: string }>('/events/:id_hash');

  const theme = useContext(ThemeContext);
  const currentUser = useSelector<reduxStateT, userT>(({ user }) => user);
  const isChatVisible = useSelector<reduxStateT, boolean>(
    ({ event: { isChatVisible } }) => isChatVisible,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // reset menu and chat visibility if landing on an event page
    if (match && match.params.id_hash !== 'new') {
      setIsMenuOpen(false);
      dispatch(setIsChatVisible(false));
    } else {
      setIsMenuOpen(true);
    }
  }, [dispatch, location, match]);

  const toggleMenu = () => {
    setIsMenuOpen((menuOpen) => !menuOpen);
  };

  const toggleChatVisibility = () => {
    dispatch(toggleChat());
  };

  return (
    <div>
      {match && match.params.id_hash !== 'new' && (
        <Harbungen>
          <HamburgerMenu
            isOpen={isMenuOpen}
            color={theme.colors.roseOfSharon}
            menuClicked={toggleMenu}
            width={30}
            height={19}
            strokeWidth={1}
          />
        </Harbungen>
      )}
      <Navbar visible={isMenuOpen}>
        <NavList>
          <NavListItem>
            <Link to="/">Home</Link>
          </NavListItem>
          {!currentUser.data.isEmpty() && (
            <NavListItem>
              <Link to="/events/new">New Event</Link>
            </NavListItem>
          )}
          <NavListItem>
            <Link to="/about">About</Link>
          </NavListItem>
        </NavList>
        <User>
          {currentUser.data.fold(
            () => (
              <NavListItem>
                <Link to="/login">Login</Link>
              </NavListItem>
            ),
            ({ name }) => (
              <>
                <UserName id="display-name">{name}</UserName>
                <NavListItem>
                  <ExternalLink asButton href="/auth/logout">
                    Logout
                  </ExternalLink>
                </NavListItem>
              </>
            ),
          )}
        </User>
      </Navbar>
      {match && match.params.id_hash !== 'new' && (
        <NavbarNarrow visible={!isMenuOpen}>
          <ChatToggleButton onClick={toggleChatVisibility}>
            {isChatVisible ? 'Show event panel' : 'Show chat'}
          </ChatToggleButton>
        </NavbarNarrow>
      )}
    </div>
  );
};

export default Nav;
