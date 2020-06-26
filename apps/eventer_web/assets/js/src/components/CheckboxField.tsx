import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  margin-left: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.emperor};
`;

const Input = styled.input`
  outline-color: ${({ theme }) => theme.colors.main};
`;

const Error = styled.div`
  margin-top: 3px;
  width: 273px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.milanoRed};
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
  const [_field, meta, _helpers] = useField(name);

  return (
    <FieldWrapper>
      <Input
        name={name}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <Label htmlFor={name}>{label}</Label>
      {meta.touched && meta.error ? <Error>{meta.error}</Error> : null}
    </FieldWrapper>
  );
};

export default CheckboxField;
