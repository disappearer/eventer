import React from 'react';
import styled from 'styled-components';
import { useField } from 'formik';

const FieldWrapper = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.emperor};
`;

type inputPropsT = {
  inputSize: 'regular' | 'small';
};

const Input = styled.input<inputPropsT>`
  display: block;
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.emperor};
  font-size: 1rem;
  font-weight: 300;
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: ${props => props.theme.colors.mineShaft};
  width: 273px;
  ${props =>
    props.inputSize === 'regular'
      ? `
    width: 273px
  `
      : ''}

  ${props =>
    props.inputSize === 'small'
      ? `
    width: 173px;
    font-size: 0.9rem;
  `
      : ''}

  &:focus {
    border-bottom: 1px solid black;
  }

  &:disabled {
    text-align: center;
  }
`;

const Error = styled.div`
  margin-top: 3px;
  width: 273px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.milanoRed};
`;

type textFieldPropsT = {
  name: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  noLabel?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputSize?: 'regular' | 'small';
};

const TextField: React.FC<textFieldPropsT> = ({
  name,
  label = '',
  onChange,
  value,
  placeholder,
  disabled = false,
  noLabel = false,
  onFocus = () => {},
  inputSize = 'regular',
}) => {
  const [_field, meta, _helpers] = useField(name); 
  return (
    <FieldWrapper>
      {!noLabel && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={disabled ? 'TBD' : value}
        disabled={disabled}
        onFocus={onFocus}
        inputSize={inputSize}
      />
      {meta.touched && meta.error ? (
        <Error>{meta.error}</Error>
      ) : null}
    </FieldWrapper>
  );
};

export default TextField;
