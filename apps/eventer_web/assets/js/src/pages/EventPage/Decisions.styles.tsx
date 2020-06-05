import styled from 'styled-components';

export const DecisionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 490px) {
    padding-right: 0;
  }
`;

export const DecisionListTitleLine = styled.div`
  flex: none;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 20px;
  justify-content: start;
  justify-items: start;
  align-items: center;
  margin-bottom: 14px;
`;

export const DecisionListTitle = styled.h3`
  display: inline-block;
  margin: 0;
`;

export const DecisionTitleLine = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  justify-content: start;
  justify-items: start;
  align-items: center;
`;

export const DecisionTitle = styled.h4`
  margin: 0;
  display: inline-block;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const DecisionList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Decision = styled.div`
  margin-bottom: 19px;
`;

export const Description = styled.div`
  margin-top: 5px;
  white-space: pre-line;
`;

export const Objective = styled.div`
  margin-top: 5px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.darkerGrey};
`;
