import styled from 'styled-components';

export const EventPageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const LoaderWrapper = styled.div`
padding-top: 100px;
`;

export const DecisionsAndChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;

  @media (max-width: 380px) {
    min-height: auto;
  }

  @media (max-height: 530px) {
    min-height: auto;
    max-height: calc(100vh - 3px);
  }
`;



export const HorizontalSeparator = styled.div`
  flex: none;
  margin: 14px 0;
  height: 1px;
  background: linear-gradient(
    to left,
    transparent,
    ${props => props.theme.colors.bright},
    transparent
  );
`;

export const VerticalSeparator = styled.div`
  width: 1px;
  // margin: 13px 0;
  height: 90%;
  background: linear-gradient(
    to bottom,
    transparent,
    ${props => props.theme.colors.bright},
    transparent
  );

  // background: linear-gradient(
  //   to bottom,
  //   ${props => props.theme.colors.bright},
  //   transparent
  // );

  @media (max-width: 490px) {
    display: none;
  }
`;
