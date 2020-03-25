import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import '../../../css/react-datepicker.css';

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: ${props => props.theme.colors.grey}
`;

type timeFieldPropsT = {
  onChange: (t: Date | null) => void;
  selected?: Date | null;
  disabled: boolean;
};

const TimeField: React.FC<timeFieldPropsT> = ({
  onChange,
  selected,
  disabled,
}) => {
  return (
    <div>
      <Label htmlFor="time">Time</Label>
      <DatePicker
        name="time"
        showTimeSelect
        timeIntervals={15}
        selected={selected}
        onChange={onChange}
        dateFormat="MMMM d, yyyy h:mm aa"
        disabled={disabled}
        value={disabled ? 'TBD' : undefined}
      />
    </div>
  );
};

export default TimeField;
