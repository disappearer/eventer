import React from 'react';
import styled, { keyframes } from 'styled-components';

type loaderPropsT = {
  height?: string;
  circleSize?: circleSizeT;
  color?: string;
};

const animation = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
`;

const Wrapper = styled.div<loaderPropsT>`
  margin: 0 auto;
  height: ${({ height }) => height || 'auto'};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  max-width: 100px;
  text-align: center;
`;

type circleSizeT = 'normal' | 'small';
type circlePropsT = {
  size: circleSizeT;
  color?: string;
};
const Circle = styled.div<circlePropsT>`
  width: ${({ size }) => (size === 'normal' ? '7' : '4')}px;
  height: ${({ size }) => (size === 'normal' ? '7' : '4')}px;
  margin: 0 5px;
  background-color: ${({ theme, color }) => color || theme.colors.main};

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

const Loader: React.FC<loaderPropsT> = ({
  height,
  circleSize = 'normal',
  color,
}) => (
  <Wrapper height={height}>
    <FirstCircle size={circleSize} color={color} />
    <SecondCircle size={circleSize} color={color} />
    <Circle size={circleSize} color={color} />
  </Wrapper>
);

export default Loader;
