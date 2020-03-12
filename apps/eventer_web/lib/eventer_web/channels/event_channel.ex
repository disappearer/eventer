defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.IdHasher
  alias Eventer.Persistence.{Events, Users}

  def join("event:" <> event_id_hash, _message, socket) do
    event =
      event_id_hash
      |> IdHasher.decode()
      |> Events.get_event()
      |> Events.to_map()

    {:ok, %{event: event}, assign(socket, :event_id, event.id)}
  end

  def handle_in("join_event", %{}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    {:ok, _} = Events.join(socket.assigns.event_id, user.id)

    broadcast(socket, "user_joined", %{user: Users.to_map(user)})
    {:reply, {:ok, %{}}, socket}
  end
end
