import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import theme from '../common/theme';

type styledButtonPropsT = {
  primary?: boolean;
  isSubmitting?: boolean;
};

const StyledButton = styled.button<styledButtonPropsT>`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.roseOfSharon};
  border-radius: 5px;
  padding: ${(props) => (props.primary ? '7px' : '5px')};
  font-size: ${(props) => (props.primary ? '1rem' : '0.8rem')};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.milanoRedTransparenter};
    cursor: pointer;
  }

  &: disabled {
    color: ${({ theme }) => theme.colors.grey};
    background-color: transparent;
    border: 1px solid
      ${(props) =>
        props.isSubmitting
          ? props.theme.colors.roseOfSharon
          : props.theme.colors.grey};
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
        <Loader
          height={loaderHeight}
          circleSize="small"
          color={theme.colors.roseOfSharon}
        />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
