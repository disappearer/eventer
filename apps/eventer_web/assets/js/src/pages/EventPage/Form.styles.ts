import styled from 'styled-components';
import TextArea from 'react-autosize-textarea';

export const FormTitle = styled.h3`
  margin-top: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  justify-items: start;
  grid-gap: 17px;
`;

export const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 70px);
  justify-content: center;
  grid-gap: 30px;
`;

export const Input = styled(TextArea)`
  width: 280px;
  margin-bottom: 20px;
  line-height: 16px;
  font-size: 1rem;
  font-weight: 300;
  font-family: 'Helvetica', 'Arial', sans-serif;
  padding: 7px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.main};

  resize: none;
`;
