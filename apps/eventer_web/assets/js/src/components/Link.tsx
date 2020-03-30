import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  text-decoration: none;

  color: ${props => props.theme.colors.main};

  &:visited {
    color: ${props => props.theme.colors.main};
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;

  color: ${props => props.theme.colors.main};
`;

const Button = (component: any) => styled(component)`
  border: 1px solid ${props => props.theme.colors.main};
  border-radius: 5px;
  padding: 7px;

  &:hover {
    background-color: ${props => props.theme.colors.main};
    color: white;
  }
`;

type linkPropsT = {
  external?: boolean;
  asButton?: boolean;
  to: string;
};
const Link: React.FC<linkPropsT> = ({
  external = false,
  asButton = false,
  to,
  children,
}) => {
  const component = external ? StyledAnchor : StyledLink;
  const Link = asButton ? Button(component) : component;
  return external ? (
    <Link href={to}>{children}</Link>
  ) : (
    <Link to={to}>{children}</Link>
  );
};

export default Link;
