import React from 'react';
import styled from 'styled-components';
import CommonTop from '../../components/Top';
import CommonTitle from '../../components/Title';

const Top = styled(CommonTop)`
  align-content: center;
`;

const Title = styled(CommonTitle)`
  margin-bottom: 0;
`;

const SubTitle = styled.h3`
  justify-self: center;
  letter-spacing: 0.2rem;
  color: ${({ theme }) => theme.colors.pale};
  align-self: start;
  margin: 0;
  text-align: center;
`;

const Description = styled.div`
  margin-top: 53px;
  align-self: center;
  max-width: 700px;
  color: ${({ theme }) => theme.colors.tundora};
`;

const Paragraph = styled.p`
  letter-spacing: 0;
  text-align: justify;
`;

const DoIt = styled(Paragraph)`
  margin-top: 73px;
  text-align: center;
`;

const Welcome: React.FC = () => (
  <>
    <Top>
      <Title>Eventer</Title>
      <SubTitle>Organize events with your friends and enemies</SubTitle>
    </Top>
    <Description>
      <Paragraph>
        Eventer is an app designed to aid groups of people in event
        organizing. If you don't know when or where the event will happen, you
        can decide that with your friends. If you can't attend, just don't
        join an event and you won't be spammed with messages as you normally
        would in group chats or mailing lists. You can plan hikes, road-trips,
        parties, bank robberies and whatever you can imagine. The sky is the
        limit!
      </Paragraph>
      <DoIt>Log in and start the fun!</DoIt>
    </Description>
  </>
);

export default Welcome;
