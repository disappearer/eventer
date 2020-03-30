import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { pollT } from './types';

const Question = styled.div`
  margin-bottom: 7px;
`;

const Options = styled.div`
  display: grid;
  justify-items: start;
`;

type optionPropsT = {
  selected?: boolean;
};

const Option = styled.div<optionPropsT>`
  font-size: 0.9rem;
  margin-bottom: 5px;
  padding: 5px;
  text-align: center;
  border-radius: 3px;
  ${props =>
    props.selected
      ? `border: 1px solid ${props.theme.colors.pale};`
      : 'border: 1px solid transparent;'}

  &:hover {
    cursor: pointer;
  }
`;

type pollPropsT = {
  poll: pollT;
  hasVoted: boolean;
};

const Poll: React.FC<pollPropsT> = ({ poll, hasVoted }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');

  const handleCustomOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomOption(event.target.value);
  };

  const toggleSelectedOption = (id: string) => {
    setSelectedOption(current => (current === id ? '' : id));
  };

  const canSubmitVote =
    selectedOption === 'custom' ? customOption !== '' : selectedOption !== '';

  const { question, fixed, options, votes } = poll;
  return (
    <div>
      <Question>{question}</Question>
      <Options>
        {options.map(({ id, text }) => (
          <Option
            selected={selectedOption === id}
            key={id}
            onClick={() => toggleSelectedOption(id)}
          >
            {text}
          </Option>
        ))}
        {!hasVoted && !fixed && (
          <Option>
            <TextField
              inputSize="small"
              name="custom-option"
              placeholder="Custom option"
              onFocus={() => toggleSelectedOption('custom')}
              onChange={handleCustomOptionChange}
              value={customOption}
            />
          </Option>
        )}
        {<Button disabled={!canSubmitVote}>Submit vote</Button>}
      </Options>
    </div>
  );
};

export default Poll;
