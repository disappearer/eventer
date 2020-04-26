import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { pollT, voteT } from './types';
import { useAuthorizedUser } from '../../features/authentication/useAuthorizedUser';
import PollResults from './PollResults';
import { Formik, Form } from 'formik';

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
  color: ${(props) => props.theme.colors.darkerGrey};
  max-width: 273px;
`;

type optionPropsT = {
  selected?: boolean;
};

const Option = styled.div<optionPropsT>`
  font-size: 0.9rem;
  padding: 5px 17px;
  text-align: center;
  border-radius: 27px;
  ${(props) =>
    props.selected
      ? `border: 1px solid ${props.theme.colors.pale};
          background: ${props.theme.colors.paler};`
      : `border: 1px solid ${props.theme.colors.lighterGrey};`}

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 3px ${(props) => props.theme.colors.main};
  }
`;

const CustomOption = styled(Option)`
  text-align: left;
  border: 1px solid transparent;
  padding: 5px;

  &:hover {
    cursor: default;
    box-shadow: none;
  }
`;

type valuesT = {
  customOption: string;
};

type pollPropsT = {
  decisionId: number;
  poll: pollT;
  onVote: voteT;
  pending: boolean;
};

const Poll: React.FC<pollPropsT> = ({ decisionId, poll, onVote, pending }) => {
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

  const {
    question,
    custom_answer_enabled,
    options,
    multiple_answers_enabled,
  } = poll;

  const toggleSelectedOption = (id: string) => {
    setSelectedOptions((currentlySelectedOptions) => {
      if (multiple_answers_enabled) {
        if (currentlySelectedOptions.includes(id)) {
          return currentlySelectedOptions.filter((optionId) => optionId !== id);
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

  return (
    <div>
      <Question>{question}</Question>
      {hasVoted || !pending ? (
        <PollResults options={options} />
      ) : (
        <Formik<valuesT>
          initialValues={{
            customOption: '',
          }}
          onSubmit={(_values, { setErrors, setSubmitting }) => {
            onVote(
              {
                decisionId,
                customOption:
                  customOptionText === '' ? null : { text: customOptionText },
                optionsVotedFor: selectedOptions,
              },
              (errors) => {
                setSubmitting(false);
                setErrors(errors);
              },
            );
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <Options>
                  <Description>
                    {options.length > 0 && 'Choose an answer'}
                    {options.length > 0 &&
                      custom_answer_enabled &&
                      ' or provide your own'}
                    {options.length === 0 && 'Provide your answer'}.
                    {multiple_answers_enabled &&
                      options.length > 0 &&
                      ' You can choose more than one.'}
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
                  {!hasVoted && custom_answer_enabled && (
                    <CustomOption>
                      <TextField
                        inputSize="small"
                        name="customOption"
                        placeholder="Custom option"
                        onFocus={() => toggleSelectedOption('custom')}
                        onChange={handleCustomOptionTextChange}
                        value={customOptionText}
                      />
                    </CustomOption>
                  )}
                </Options>
                <Button
                  type="submit"
                  disabled={!canSubmitVote}
                  isSubmitting={isSubmitting}
                >
                  Submit vote
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default Poll;
