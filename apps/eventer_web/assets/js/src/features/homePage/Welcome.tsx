import React from 'react';
import {
  MainWrapper,
  Top as CommonTop,
  Title as CommonTitle,
} from './common.styled';
import styled from 'styled-components';

const Top = styled(CommonTop)`
  align-content: center;
`;

const Title = styled(CommonTitle)`
  margin-bottom: 0;
`;

const SubTitle = styled.h3`
  justify-self: center;
  letter-spacing: 0.2rem;
  color: ${props => props.theme.colors.pale};
  align-self: start;
  margin: 0;
  text-align: center;
`;

const Description = styled.div`
  margin-top: 53px;
  max-width: 700px;
  color: #444;
`;

const Paragraph = styled.p`
  letter-spacing: 0;
`;

const DoIt = styled(Paragraph)`
  margin-top: 73px;
  text-align: center;
`;

const Welcome: React.FC = () => {
  return (
    <MainWrapper>
      <Top>
        <Title>Eventer</Title>
        <SubTitle>Organize events with your friends and enemies</SubTitle>
      </Top>
      <Description>
        <Paragraph>
          Are you tired of overly complicated, rigid event organizing tools? Are
          you tired of sifting through countless messages or emails when trying
          to make things happen with your friends? Are you tired of trying to
          figure out who said what? Are you tired of not having the ability to
          set clear planning goals? Are you tired of being forced to define a
          time or place of the event? Are you tired of being spammed with
          messages for stuff you can't participate in? Do you want to break
          free?
        </Paragraph>
        <DoIt>Log in and start the fun!</DoIt>
      </Description>
    </MainWrapper>
  );
};

export default Welcome;
