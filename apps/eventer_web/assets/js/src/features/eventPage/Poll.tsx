import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { pollT, voteT } from './types';
import { useAuthorizedUser } from '../authentication/useAuthorizedUser';
import PollResults from './PollResults';

const Question = styled.div`
  margin-bottom: 7px;
`;

const Options = styled.div`
  display: grid;
  justify-items: start;
  grid-gap: 7px;
  margin-bottom: 14px;
`;

const Description = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkerGrey};
  max-width: 273px;
`;

type optionPropsT = {
  selected?: boolean;
};

const Option = styled.div<optionPropsT>`
  font-size: 0.9rem;
  padding: 5px;
  text-align: center;
  border-radius: 3px;
  ${props =>
    props.selected
      ? `border: 1px solid ${props.theme.colors.pale};
          background: ${props.theme.colors.paler};`
      : 'border: 1px solid transparent;'}

  &:hover {
    cursor: pointer;
    border: 1px solid ${props => props.theme.colors.lighterGrey};
  }
`;

const CustomOption = styled(Option)`
  &:hover {
    cursor: default;
    border: 1px solid transparent;
  }
`;

type pollPropsT = {
  decisionId: number;
  poll: pollT;
  onVote: voteT;
};

const Poll: React.FC<pollPropsT> = ({ decisionId, poll, onVote }) => {
  const { id: currentUserId } = useAuthorizedUser();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setHasVoted(poll.voted_by.includes(currentUserId));
  }, [currentUserId, poll]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customOptionText, setCustomOptionText] = useState('');

  const handleCustomOptionTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomOptionText(event.target.value);
  };

  const { question, fixed, options, multiple_votes } = poll;

  const toggleSelectedOption = (id: string) => {
    setSelectedOptions(currentlySelectedOptions => {
      if (multiple_votes) {
        if (currentlySelectedOptions.includes(id)) {
          return currentlySelectedOptions.filter(optionId => optionId !== id);
        } else {
          return [...currentlySelectedOptions, id];
        }
      } else {
        return currentlySelectedOptions === [id] ? [] : [id];
      }
    });
  };

  const canSubmitVote =
    selectedOptions.length > 0 &&
    (selectedOptions.includes('custom')
      ? customOptionText !== '' || selectedOptions.length > 1
      : true);

  const submitVote = () => {
    const customOption =
      customOptionText === '' ? null : { text: customOptionText };
    onVote(decisionId, customOption, selectedOptions);
  };

  return (
    <div>
      <Question>{question}</Question>
      {hasVoted ? (
        <PollResults options={options} />
      ) : (
        <>
          <Options>
            <Description>
              {options.length > 0 && 'Choose an answer'}
              {options.length > 0 && !fixed && ' or provide your own'}
              {options.length === 0 && 'Provide your answer'}.
              {multiple_votes && ' You can choose more than one.'}
            </Description>
            {options.map(({ id, text }) => (
              <Option
                selected={selectedOptions.includes(id)}
                key={id}
                onClick={() => toggleSelectedOption(id)}
              >
                {text}
              </Option>
            ))}
            {!hasVoted && !fixed && (
              <CustomOption>
                <TextField
                  inputSize="small"
                  name="custom-option"
                  placeholder="Custom option"
                  onFocus={() => toggleSelectedOption('custom')}
                  onChange={handleCustomOptionTextChange}
                  value={customOptionText}
                />
              </CustomOption>
            )}
          </Options>
          <Button disabled={!canSubmitVote} onClick={submitVote}>
            Submit vote
          </Button>
        </>
      )}
    </div>
  );
};

export default Poll;
