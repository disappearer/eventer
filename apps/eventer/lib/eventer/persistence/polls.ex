defmodule Polls do
  alias Eventer.Poll
  alias Eventer.Poll.Option

  def to_map(%Poll{} = poll) do
    %{
      question: poll.question,
      fixed: poll.fixed,
      votes: poll.votes,
      options: Enum.map(poll.options, &option_to_map/1)
    }
  end

  def to_map(nil), do: nil

  def option_to_map(%Option{} = option) do
    %{
      id: option.id,
      text: option.text
    }
  end
end
