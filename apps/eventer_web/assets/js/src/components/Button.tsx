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
  line-height: 1;
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
  disabled,
  children,
  ...props
}) => {
  const loaderHeight = props.primary ? '1rem' : '0.8rem';
  return (
    <StyledButton
      {...props}
      isSubmitting={isSubmitting}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <Loader height={loaderHeight} circleSize="small" />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
