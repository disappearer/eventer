defmodule Eventer.Persistence.Decisions do
  alias Eventer.{Decision, Repo}
  alias Eventer.Persistence.Events

  def get_decision(id) do
    Repo.get(Decision, id)
  end

  def insert_decision(attrs) do
    %Decision{}
    |> Decision.standalone_changeset(attrs)
    |> Repo.insert()
  end

  def delete_decision(decision) do
    decision
    |> Decision.delete_changeset()
    |> Repo.delete()
  end

  def update_decision(decision, attrs) do
    decision
    |> Decision.update_changeset(attrs)
    |> Repo.update()
  end

  def resolve_decision(decision, resolution) do
    case decision.objective do
      "time" -> update_event_time(decision, resolution)
      "place" -> update_event_place(decision, resolution)
      _ -> nil
    end

    update_decision(decision, %{resolution: resolution, pending: false})
  end

  defp update_event_time(decision, time_string) do
    {:ok, time, _} = DateTime.from_iso8601(time_string)

    decision
    |> Repo.preload(:event)
    |> Map.get(:event)
    |> Events.update_event(%{time: time})
  end

  defp update_event_place(decision, place) do
    decision
    |> Repo.preload(:event)
    |> Map.get(:event)
    |> Events.update_event(%{place: place})
  end

  def discard_resolution(decision) do
    update_decision(decision, %{resolution: nil, pending: true})
  end

  def update_poll(decision, poll) do
    update_decision(decision, %{poll: poll})
  end

  def vote(decision, user_id, option_id) do
    update_poll(decision, %{votes: %{user_id => option_id}})
  end

  def add_option(decision, option_text) do
    old_options = decision.poll.options |> Enum.map(&Map.from_struct/1)
    new_option = %{text: option_text}
    update_poll(decision, %{options: old_options ++ [new_option]})
  end

  def remove_option(decision, option_id) do
    new_options =
      decision.poll.options
      |> Enum.map(&Map.from_struct/1)
      |> Enum.filter(fn option ->
        option.id !== option_id
      end)

    update_poll(decision, %{options: new_options})
  end

  def vote_new(decision, user_id, new_option_text) do
    {:ok, decision_with_new_option} = add_option(decision, new_option_text)
    %{id: new_option_id} = List.last(decision_with_new_option.poll.options)
    vote(decision_with_new_option, user_id, new_option_id)
  end

  def remove_poll(decision) do
    update_poll(decision, nil)
  end

  def to_map(%Decision{} = decision) do
    %{
      id: decision.id,
      title: decision.title,
      description: decision.description,
      objective: decision.objective,
      pending: decision.pending,
      resolution: decision.resolution,
      creator_id: decision.creator_id,
      event_id: decision.event_id,
      poll: decision.poll
    }
  end
end
