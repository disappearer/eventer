defmodule Eventer.Converter do
  alias Eventer.{Event, Decision}

  def to_state_map(%Event{} = event) do
    event
    |> to_map()
    |> decisions_to_map()
  end

  def to_map(struct) do
    struct
    |> Map.from_struct()
    |> Map.drop([:__meta__, :inserted_at, :updated_at])
  end

  def decisions_to_map(event) do
    event
    |> Map.update(:decisions, [], fn decisions ->
      Enum.reduce(decisions, %{}, fn decision, decisions_map ->
        Map.put_new(decisions_map, decision.id, to_map(decision))
      end)
    end)
  end

  def to_event_struct(event_map) do
    t = decisions_to_struct_list(event_map)
    struct(%Event{}, t)
  end

  def decisions_to_struct_list(event_map) do
    event_map
    |> Map.update(:decisions, [], fn decisions ->
      Enum.map(decisions, fn {_id, decision} ->
        decision
      end)
    end)
  end
end
