import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import { useAuthorizedUser } from '../../../../features/authentication/useAuthorizedUser';
import {
  CustomOption,
  Description,
  Option,
  Options,
  Question,
} from './Poll.styles';
import PollResults from './PollResults';
import { pollT, voteT } from '../../types';

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
  const {
    question,
    custom_answer_enabled,
    options,
    multiple_answers_enabled,
  } = poll;

  const { id: currentUserId } = useAuthorizedUser();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setHasVoted(poll.voted_by.includes(currentUserId));
  }, [currentUserId, poll]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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

  const [customOptionText, setCustomOptionText] = useState('');

  const handleCustomOptionTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomOptionText(event.target.value);
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
