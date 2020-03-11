defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.IdHasher
  alias Eventer.Persistence.Events

  def join("event:" <> event_id_hash, _message, socket) do
    event =
      event_id_hash
      |> IdHasher.decode()
      |> Events.get_event()
      |> Events.to_map()

    {:ok, %{event: event}, socket}
  end
end
