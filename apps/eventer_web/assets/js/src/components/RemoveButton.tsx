import styled from 'styled-components';
import { Delete } from '@styled-icons/material';

const RemoveButton = styled(Delete)`
  margin-left: 7px;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
  }
`;

export default RemoveButton;
