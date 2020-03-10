defmodule EventerWeb.EventView do
  use EventerWeb, :view

  alias EventerWeb.IdHasher

  def render("event.json", %{event_id_hash: event_id_hash}) do
    %{event_id_hash: event_id_hash}
  end

  def render("events.json", %{events: events}) do
    events =
      Enum.map(events, fn event ->
        %{
          title: event.title,
          time: event.time,
          place: event.place,
          id_hash: IdHasher.encode(event.id)
        }
      end)

    %{events: events}
  end

  def render("error.json", %{errors: errors}) do
    %{errors: errors}
  end
end
