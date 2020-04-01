defmodule Polls do
  alias Eventer.Poll
  alias Eventer.Poll.Option

  def to_map(%Poll{} = poll) do
    {voted_by, options} =
      Enum.reduce(poll.votes, {[], poll.options}, fn vote, acc ->
        {user_id, option_ids} = vote
        {user_id, _} = Integer.parse(user_id)

        {voted_by, options} = acc
        voted_by_with_user = [user_id | voted_by]

        options_with_votes =
          Enum.map(options, fn option ->
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

    %{
      question: poll.question,
      fixed: poll.fixed,
      voted_by: voted_by,
      options: options
    }
  end

  def to_map(nil), do: nil

  def option_to_map(%Option{} = option) do
    %{
      id: option.id,
      text: option.text,
      votes: []
    }
  end
end
