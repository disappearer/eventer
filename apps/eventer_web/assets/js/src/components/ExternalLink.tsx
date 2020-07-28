import React from 'react';
import styled from 'styled-components';

const StyledAnchor = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
`;

const StyledAnchorButton = styled(StyledAnchor)`
  color: ${({ theme }) => theme.colors.roseOfSharon};
  border: 1px solid ${({ theme }) => theme.colors.roseOfSharon};
  border-radius: 5px;
  padding: 5px;
  text-decoration: none;

  &:hover {
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.milanoRedTransparenter};
    cursor: pointer;
  }
`;

type linkPropsT = {
  asButton?: boolean;
  href: string;
};
const ExternalLink: React.FC<linkPropsT> = ({
  asButton = false,
  children,
  ...props
}) => (asButton ? (
  <StyledAnchorButton {...props}>{children}</StyledAnchorButton>
) : (
  <StyledAnchor target="_blank" {...props}>
    {children}
  </StyledAnchor>
));

export default ExternalLink;
