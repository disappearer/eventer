import { useField } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import '../../../css/react-datepicker.css';

const Error = styled.div`
  margin-top: 3px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.milanoRed};
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.emperor};
`;

type timeFieldPropsT = {
  name?: string;
  onChange: (t: Date | null) => void;
  selected?: Date | null;
  disabled: boolean;
};

const TimeField: React.FC<timeFieldPropsT> = ({
  onChange,
  selected,
  disabled,
  name = 'time'
}) => {
  const [_field, meta, _helpers] = useField(name);
  return (
    <div>
      <Label htmlFor={name}>Time</Label>
      <DatePicker
        name={name}
        showTimeSelect
        timeIntervals={15}
        selected={selected}
        onChange={onChange}
        dateFormat="MMMM d, yyyy h:mm aa"
        disabled={disabled}
        value={disabled ? 'TBD' : undefined}
      />
      {meta.touched && meta.error ? <Error>{meta.error}</Error> : null}
    </div>
  );
};

export default TimeField;
