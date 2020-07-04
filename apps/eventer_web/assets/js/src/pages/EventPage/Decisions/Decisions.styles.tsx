import { PlaylistAdd } from '@styled-icons/material';
import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from '../Chat/Chat.util';
import { Question, Check } from '@styled-icons/evil';
import RemoveButton from '../../../components/RemoveButton';
import { Time, Location } from '@styled-icons/ionicons-sharp';

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

export const DecisionListTitle = styled.h4`
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
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.roseOfSharon};
`;

export const TimeIcon = styled(Time)`
  margin-left: 5px;
  width: 17px;
  height: 17px;
  color: ${({ theme }) => theme.colors.roseOfSharon}bb;
`;

export const LocationIcon = styled(Location)`
  margin-left: 5px;
  width: 17px;
  height: 17px;
  color: ${({ theme }) => theme.colors.roseOfSharon}bb;
`;

export const PendingIcon = styled(Question)`
  margin-right: 2px;
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.colors.lemonGinger};

  &:hover {
    color: ${({ theme }) => theme.colors.lemonGinger};
  }
`;

export const ResolvedIcon = styled(Check)`
  margin-right: 2px;
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.colors.apple};

  &:hover {
    color: ${({ theme }) => theme.colors.apple};
  }
`;

export const AddButton = styled(PlaylistAdd)`
  margin-left: 7px;
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }
`;

export const DecisionList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const RemoveDecisionButton = styled(RemoveButton)`
  visibility: hidden;
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
  padding-left: 5px;
  white-space: pre-line;
`;

export const Objective = styled.div`
  margin-top: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.emperor};
`;
