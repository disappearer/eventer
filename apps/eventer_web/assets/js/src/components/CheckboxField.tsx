import React from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  margin-left: 5px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.grey}
`;

const Input = styled.input`
  outline-color: ${props => props.theme.colors.link};
`;

type checkboxFieldPropsT = {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<any>) => void;
};

const CheckboxField: React.FC<checkboxFieldPropsT> = ({
  name,
  label,
  onChange,
}) => {
  return (
    <FieldWrapper>
      <Input name={name} type="checkbox" onChange={onChange} />
      <Label htmlFor={name}>{label}</Label>
    </FieldWrapper>
  );
};

export default CheckboxField;
