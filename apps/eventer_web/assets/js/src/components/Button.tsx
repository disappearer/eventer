import styled from 'styled-components';

type buttonPropsT = {
  primary?: boolean;
}

const Button = styled.button<buttonPropsT>`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.linkVisited};
  border-radius: 5px;
  padding: ${props => props.primary ? '7px' : '5px'};
  font-size: ${props => props.primary ? '1rem' : '0.8rem'};
  font-weight: 300;
  line-height: ${props => props.primary ? '1.6' : '1'};
  color: ${props => props.theme.colors.linkVisited};

  &:hover {
    background-color: ${props => props.theme.colors.linkVisited};
    color: white;
  }
`;

export default Button;