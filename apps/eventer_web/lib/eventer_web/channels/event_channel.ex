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

  def handle_in("leave_event", %{}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    Events.leave(socket.assigns.event_id, user.id)

    broadcast(socket, "user_left", %{userId: user.id})
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("update_event", %{"event" => event_data}, socket) do
    {:ok, _ } = Events.get_event(socket.assigns.event_id)
    |> Events.update_event(event_data)

    broadcast(socket, "event_updated", %{event: event_data})
    {:reply, {:ok, %{}}, socket}
  end
end
