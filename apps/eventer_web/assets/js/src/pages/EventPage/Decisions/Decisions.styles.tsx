import { AddCircleOutline } from '@styled-icons/material';
import { Delete } from '@styled-icons/material';
import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from '../Chat/Chat.util';

export const DecisionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    padding-right: 0;
  }

  overflow: hidden;
`;

export const DecisionListTitleLine = styled.div`
  flex: none;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

export const DecisionListTitle = styled.h5`
  display: inline-block;
  margin: 0;
`;

export const DecisionTitleLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DecisionTitle = styled.h4`
  margin: 0;
  display: inline-block;
  color: ${({ theme }) => theme.colors.roseOfSharon};
`;

export const AddButton = styled(AddCircleOutline)`
  margin-left: 7px;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }

  &:hover::after {
    content: 'Your tooltip';
    display: block;
    position: relative;
    top: -16px;
    right: -16px;
    width: 100px;
    background: lightblue;
  }
`;

export const DecisionList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const RemoveButton = styled(Delete)`
  margin-left: 7px;
  width: 20px;
  height: 20px;
  visibility: hidden;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }
`;

export const Decision = styled.div`
  padding: 13px 5px;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.roseOfSharon}0f;
    border-radius: 5px;
    ${RemoveButton} {
      visibility: visible;
    }
  }
`;
export const Description = styled.div`
  white-space: pre-line;
`;

export const Objective = styled.div`
  margin-top: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.emperor};
`;
