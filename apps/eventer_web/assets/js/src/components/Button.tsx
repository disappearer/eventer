import styled from 'styled-components';

type buttonPropsT = {
  primary?: boolean;
};

const Button = styled.button<buttonPropsT>`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.main};
  border-radius: 5px;
  padding: ${props => (props.primary ? '7px' : '5px')};
  font-size: ${props => (props.primary ? '1rem' : '0.8rem')};
  font-weight: 300;
  line-height: ${props => (props.primary ? '1.6' : '1')};
  color: ${props => props.theme.colors.main};
  // min-width: 80px;

  &:hover {
    background-color: ${props => props.theme.colors.main};
    color: white;
    cursor: pointer;
  }

  &: disabled {
    color: ${props => props.theme.colors.lighterGrey};
    background-color: transparent;
    border: 1px solid ${props => props.theme.colors.lighterGrey};
    cursor: default;
  }
`;

export default Button;
