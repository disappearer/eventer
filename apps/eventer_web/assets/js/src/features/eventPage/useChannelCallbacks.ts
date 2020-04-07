import { Option } from 'funfix';
import { Channel } from 'phoenix';
import { useCallback } from 'react';
import {
  addDecisionT,
  addPollT,
  discardResolutionT,
  openDiscussionT,
  removeDecisionT,
  resolveDecisionT,
  updateDecisionT,
  updateEventT,
  voteT,
} from './types';

type useChannelCallbacksT = (
  channel: Option<Channel>,
) => {
  joinEvent: () => void;
  leaveEvent: () => void;
  updateEvent: updateEventT;
  addDecision: addDecisionT;
  updateDecision: updateDecisionT;
  openDiscussion: openDiscussionT;
  resolveDecision: resolveDecisionT;
  discardResolution: discardResolutionT;
  removeDecision: removeDecisionT;
  addPoll: addPollT;
  vote: voteT;
};
const useChannelCallbacks: useChannelCallbacksT = (channel) => {
  const joinEvent = useCallback(() => {
    channel.get().push('join_event', {});
  }, [channel]);

  const leaveEvent = useCallback(() => {
    channel.get().push('leave_event', {});
  }, [channel]);

  const updateEvent = useCallback<updateEventT>(
    (data, onSuccess, onError) => {
      channel
        .get()
        .push('update_event', { event: data })
        .receive('ok', onSuccess)
        .receive('error', (response) => onError(response.errors));
    },
    [channel],
  );

  const addDecision = useCallback<addDecisionT>(
    (decision, onSuccess, onError) => {
      channel
        .get()
        .push('add_decision', { decision })
        .receive('ok', onSuccess)
        .receive('error', (response) => onError(response.errors));
    },
    [channel],
  );

  const updateDecision = useCallback<updateDecisionT>(
    (decision, onSuccess, onError) => {
      channel
        .get()
        .push('update_decision', { decision })
        .receive('ok', onSuccess)
        .receive('error', (response) => {
          onError(response.errors);
        });
    },
    [channel],
  );

  const openDiscussion = useCallback<openDiscussionT>(
    (objective, onSuccess, onError) => {
      channel
        .get()
        .push('open_discussion', { objective })
        .receive('ok', onSuccess)
        .receive('error', onError);
    },
    [channel],
  );

  const resolveDecision = useCallback<resolveDecisionT>(
    ({ decisionId, resolution }, onSuccess, onError) => {
      channel
        .get()
        .push('resolve_decision', { decision: { id: decisionId, resolution } })
        .receive('ok', onSuccess)
        .receive('error', (response) => {
          onError(response.errors);
        });
    },
    [channel],
  );

  const discardResolution = useCallback<discardResolutionT>(
    (id) => {
      channel.get().push('discard_resolution', { decision_id: id });
    },
    [channel],
  );

  const removeDecision = useCallback<removeDecisionT>(
    (id, onSuccess, onError) => {
      channel
        .get()
        .push('remove_decision', { decision_id: id })
        .receive('ok', onSuccess)
        .receive('error', onError);
    },
    [channel],
  );

  const addPoll = useCallback<addPollT>(
    ({ decisionId, poll }, onSuccess, onError) => {
      channel
        .get()
        .push('add_poll', { decision_id: decisionId, poll })
        .receive('ok', onSuccess)
        .receive('error', (response) => {
          onError(response.errors);
        });
    },
    [channel],
  );

  const vote = useCallback<voteT>(
    ({ decisionId, customOption, optionsVotedFor }, onError) => {
      channel
        .get()
        .push('vote', {
          decision_id: decisionId,
          custom_option: customOption,
          options: optionsVotedFor,
        })
        .receive('error', (response) => {
          onError(response.errors);
        });
    },
    [channel],
  );

  return {
    joinEvent,
    leaveEvent,
    updateEvent,
    addDecision,
    updateDecision,
    openDiscussion,
    resolveDecision,
    discardResolution,
    removeDecision,
    addPoll,
    vote,
  };
};

export default useChannelCallbacks;
