import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';

type styledButtonPropsT = {
  primary?: boolean;
  isSubmitting?: boolean;
};

const StyledButton = styled.button<styledButtonPropsT>`
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.colors.main};
  border-radius: 5px;
  padding: ${(props) => (props.primary ? '7px' : '5px')};
  font-size: ${(props) => (props.primary ? '1rem' : '0.8rem')};
  font-weight: 300;
  line-height: ${(props) => (props.primary ? '1.6' : '1')};
  color: ${(props) => props.theme.colors.main};
  // min-width: 80px;

  &:hover {
    background-color: ${(props) => props.theme.colors.main};
    color: white;
    cursor: pointer;
  }

  &: disabled {
    color: ${(props) => props.theme.colors.lighterGrey};
    background-color: transparent;
    border: 1px solid
      ${(props) =>
        props.isSubmitting
          ? props.theme.colors.main
          : props.theme.colors.lighterGrey};
    cursor: default;
  }
`;

type buttonPropsT = styledButtonPropsT &
  React.PropsWithoutRef<JSX.IntrinsicElements['button']> & {
    isSubmitting?: boolean;
  };
const Button: React.FC<buttonPropsT> = ({
  isSubmitting = false,
  children,
  ...props
}) => {
  return (
    <StyledButton {...props} isSubmitting={isSubmitting}>
      {isSubmitting ? <Loader /> : children}
    </StyledButton>
  );
};

export default Button;
