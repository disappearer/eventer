import styled from 'styled-components';

const Title = styled.h1`
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 20px;
  align-items: center;

  &:before,
  &:after {
    display: block;
    content: '';
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(
      to var(--direction, left),
      ${props => props.theme.colors.main},
      transparent
    );
  }

  &:after {
    --direction: right;
  }
`;

export default Title;
