import React from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.darkerGrey};
`;

type inputPropsT = {
  inputSize: 'regular' | 'small';
};

const Input = styled.input<inputPropsT>`
  display: block;
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.darkerGrey};
  font-size: 1rem;
  font-weight: 300;
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
  console.log('value', value);
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
    </FieldWrapper>
  );
};

export default TextField;
