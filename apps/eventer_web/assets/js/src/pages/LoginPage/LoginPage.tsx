import React from 'react';
import styled from 'styled-components';
import CommonTop from '../../components/Top';
import CommonTitle from '../../components/Title';
import ExternalLink from '../../components/ExternalLink';

const Top = styled(CommonTop)`
  align-content: center;
`;

const Title = styled(CommonTitle)`
  margin-bottom: 0;
`;

const SubTitle = styled.h4`
  justify-self: center;
  letter-spacing: 0.05rem;
  color: ${({ theme }) => theme.colors.pale};
  align-self: start;
  margin: 0;
  margin-top: 5px;
  text-align: center;
`;

const Description = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 53px;
  max-width: 700px;
  color: ${({ theme }) => theme.colors.tundora};
  align-self: center;
`;

const LoginPage: React.FC = () => (
  <>
    <Top>
      <Title>Log in to Eventer</Title>
      <SubTitle>
        We prefer using social logins. No username/password hassle for you or
        us, for now. More options to come soon!
      </SubTitle>
    </Top>
    <Description>
      <ExternalLink asButton href="/auth/google">
        Google Login
      </ExternalLink>
    </Description>
  </>
);

export default LoginPage;
