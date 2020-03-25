import React from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.grey}
`;

const Input = styled.input`
  display: block;
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.grey};
  font-size: 1rem;
  color: #333;
  width: 273px;
  font-weight: 300;

  &:focus {
    border-bottom: 1px solid black;
  }

  &:disabled {
    text-align: center;
  }
`;

type textFieldPropsT = {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
};

const TextField: React.FC<textFieldPropsT> = ({
  name,
  label,
  onChange,
  value,
  placeholder,
  disabled = false,
}) => {
  console.log("value", value)
  return (
    <FieldWrapper>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={disabled ? 'TBD' : value}
        disabled={disabled}
      />
    </FieldWrapper>
  );
};

export default TextField;
