import styled from 'styled-components';
import RemoveButton from '../../../../components/RemoveButton';
import { VerticalSeparator } from '../../../../components/Separator';

export const Wrapper = styled.div`
  display: flex;
  max-width: 580px;
`;

export const TitleLine = styled.div`
  margin-bottom: 5px;
`;

export const DecisionTitle = styled.h2`
  margin: 0;
`;

export const InfoArea = styled.div`
  grid-area: info;
`;

export const OtherInfo = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

export const InfoPiece = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;

  &:first-child {
    margin-right: 30px;
  }
`;

export const PollArea = styled.div``;

export const ResolutionArea = styled.div`
  margin-top: 20px;
  grid-area: resolution;
`;

export const ActionButtons = styled.div`
  display: flex;
  margin-top: 20px;
  & button {
    :not(:last-child) {
      margin-right: 20px;
    }
  }
`;

export const Label = styled.h5`
  margin: 0;
  margin-right: 10px;
`;

export const Data = styled.div`
  text-transform: uppercase;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.scorpion};
`;

export const PollSeparator = styled(VerticalSeparator)`
  height: auto;
`;

export const PollLabel = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const RemovePollButton = styled(RemoveButton)`
  margin-left: 7px;
`;

export const ResolutionLabel = styled.h4`
  margin: 0;
`;

export const RemovedDecision = styled.h4`
  display: inline;
  margin: 0;
`;

export const Resolution = styled.div`
  white-space: pre-line;
`;
