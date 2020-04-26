import React, { FC } from 'react';
import styled from 'styled-components';

const AppWrapper = styled.div`
  height: 100%;

  margin: 0 auto;
  max-width: 800px;
  position: relative;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;

  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Layout: FC = ({ children }) => (
  <AppWrapper>
    <Content>{children}</Content>
  </AppWrapper>
);

export default Layout;
