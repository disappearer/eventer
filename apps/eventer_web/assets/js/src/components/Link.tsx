import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  text-decoration: none;

  color: ${(props) => props.theme.colors.main};

  &:visited {
    color: ${(props) => props.theme.colors.main};
  }
`;

const StyledLinkButton = styled(RouterLink)`
  border: 1px solid ${(props) => props.theme.colors.main};
  border-radius: 5px;
  padding: 7px;

  &:hover {
    background-color: ${(props) => props.theme.colors.main};
    color: white;
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;

  color: ${(props) => props.theme.colors.main};
`;

const StyledAnchorButton = styled(StyledAnchor)`
  border: 1px solid ${(props) => props.theme.colors.main};
  border-radius: 5px;
  padding: 7px;

  &:hover {
    background-color: ${(props) => props.theme.colors.main};
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
  return external ? (
    asButton ? (
      <StyledAnchorButton href={to}>{children}</StyledAnchorButton>
    ) : (
      <StyledAnchor href={to}>{children}</StyledAnchor>
    )
  ) : asButton ? (
    <StyledLinkButton to={to}>{children}</StyledLinkButton>
  ) : (
    <StyledLink to={to}>{children}</StyledLink>
  );
};

export default Link;
