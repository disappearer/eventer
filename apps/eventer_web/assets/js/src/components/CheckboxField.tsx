import React from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  margin-left: 5px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.grey};
`;

const Input = styled.input`
  outline-color: ${props => props.theme.colors.link};
`;

type checkboxFieldPropsT = {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  checked?: boolean;
};

const CheckboxField: React.FC<checkboxFieldPropsT> = ({
  name,
  label,
  onChange,
  checked = false,
}) => {
  return (
    <FieldWrapper>
      <Input
        name={name}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <Label htmlFor={name}>{label}</Label>
    </FieldWrapper>
  );
};

export default CheckboxField;
