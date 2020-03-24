import styled from 'styled-components';

export const MainWrapper = styled.div`
  padding: 10px 30px;
`;

export const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

export const Title = styled.h1`
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 20px;
  align-items: center;

  color: ${props => props.theme.colors.linkVisited};

  &:before,
  &:after {
    display: block;
    content: '';
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(
      to var(--direction, left),
      ${props => props.theme.colors.primaryLine},
      transparent
    );
  }

  &:after {
    --direction: right;
  }
`;

export const Description = styled.p`
  justify-self: center;
`;
