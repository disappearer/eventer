import React, { useState } from 'react';
import { pollT } from './types';

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
      <span>{question}</span>
      <div>
        {options.map(({ id, text }) => (
          <div
            className={`poll-option${hasVoted ? '' : ' votable'} ${
              selectedOption === id ? ' selected' : ''
            }`}
            key={id}
            onClick={() => toggleSelectedOption(id)}
          >
            {text}
          </div>
        ))}
        {!hasVoted && !fixed && (
          <div
            id="custom-option"
            className={`poll-option${
              selectedOption === 'custom' ? ' selected' : ''
            }`}
          >
            <input
              placeholder="Custom option"
              onFocus={() => toggleSelectedOption('custom')}
              onChange={handleCustomOptionChange}
              value={customOption}
            ></input>
          </div>
        )}
        {<button disabled={!canSubmitVote}>Submit vote</button>}
      </div>
    </div>
  );
};

export default Poll;
