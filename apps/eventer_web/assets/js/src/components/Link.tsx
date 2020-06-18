import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  text-decoration: none;

  color: ${({ theme }) => theme.colors.secondary};

  &:visited {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StyledLinkButton = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.roseOfSharon};
  border: 1px solid ${({ theme }) => theme.colors.roseOfSharon};
  border-radius: 5px;
  padding: 7px;

  &:hover {
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.milanoRedTransparenter};
    color: white;
  }
`;

const StyledAnchor = styled.a`
  // text-decoration: none;

  color: ${({ theme }) => theme.colors.secondary};
`;

const StyledAnchorButton = styled(StyledAnchor)`
  color: ${({ theme }) => theme.colors.roseOfSharon};
  border: 1px solid ${({ theme }) => theme.colors.roseOfSharon};
  border-radius: 5px;
  padding: 5px;

  &:hover {
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.milanoRedTransparenter};
    cursor: pointer;
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
  ...props
}) => {
  return external ? (
    asButton ? (
      <StyledAnchorButton target="_blank" {...props}>
        {children}
      </StyledAnchorButton>
    ) : (
      <StyledAnchor target="_blank" {...props}>
        {children}
      </StyledAnchor>
    )
  ) : asButton ? (
    <StyledLinkButton to={to}>{children}</StyledLinkButton>
  ) : (
    <StyledLink to={to}>{children}</StyledLink>
  );
};

export default Link;
