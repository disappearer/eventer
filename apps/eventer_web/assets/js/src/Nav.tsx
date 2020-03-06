import React from 'react';
import { Link } from 'react-router-dom';

const Nav: React.FC = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <a href="/auth/logout">Logout</a>
      </li>
    </ul>
  </nav>
);

export default Nav;
