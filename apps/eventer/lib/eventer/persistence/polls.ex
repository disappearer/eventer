defmodule Polls do
  alias Eventer.Poll
  alias Eventer.Poll.Option

  def to_map(%Poll{} = poll) do
    {voted_by, options} = repack_votes(poll.options, poll.votes)

    %{
      question: poll.question,
      custom_answer_enabled: poll.custom_answer_enabled,
      multiple_answers_enabled: poll.multiple_answers_enabled,
      voted_by: voted_by,
      options: options
    }
  end

  def to_map(nil), do: nil

  defp repack_votes(options, votes) when map_size(votes) == 0 do
    {[], Enum.map(options, &option_to_map/1)}
  end

  defp repack_votes(options, votes) do
    Enum.reduce(votes, {[], options}, fn vote, acc ->
      {user_id, option_ids} = vote
      {user_id, _} = Integer.parse(user_id)

      {voted_by, prev_options} = acc
      voted_by_with_user = [user_id | voted_by]

      options_with_votes =
        Enum.map(prev_options, fn option ->
          option =
            case option do
              %Option{} -> option_to_map(option)
              _ -> option
            end

          if Enum.member?(option_ids, option.id),
            do: %{option | votes: option.votes ++ [user_id]},
            else: option
        end)

      {voted_by_with_user, options_with_votes}
    end)
  end

  def option_to_map(nil), do: nil

  def option_to_map(%Option{} = option) do
    %{
      id: option.id,
      text: option.text,
      votes: []
    }
  end
end
