import React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
`;

const Wrapper = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 100px;
  text-align: center;
`;

const Circle = styled.div`
  width: 9px;
  height: 9px;
  margin: 5px;
  background-color: ${props => props.theme.colors.main};

  border-radius: 100%;
  display: inline-block;
  animation: ${animation} 1.4s infinite ease-in-out both;
`;

const FirstCircle = styled(Circle)`
  animation-delay: -0.32s;
`;

const SecondCircle = styled(Circle)`
  animation-delay: -0.16s;
`;

const Loader: React.FC = () => (
  <Wrapper>
    <FirstCircle />
    <SecondCircle />
    <Circle />
  </Wrapper>
)

export default Loader;
