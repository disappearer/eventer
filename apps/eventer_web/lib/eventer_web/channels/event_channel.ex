defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.IdHasher
  alias Eventer.Persistence.{Events, Users, Decisions}

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
    {:ok, _} =
      Events.get_event(socket.assigns.event_id)
      |> Events.update_event(event_data)

    broadcast(socket, "event_updated", %{event: event_data})
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("update_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "title" => title, "description" => description} = decision

    case Decisions.get_decision(id)
         |> Decisions.update_decision(%{title: title, description: description}) do
      {:ok, _} ->
        broadcast(socket, "decision_updated", %{
          decision: %{id: id, title: title, description: description}
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        IO.inspect(changeset, label: "changeset")

        {:reply, {:error, %{}}, socket}
    end
  end

  def handle_in("resolve_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "resolution" => resolution} = decision

    case Decisions.get_decision(id)
         |> Decisions.resolve_decision(resolution) do
      {:ok, _} ->
        broadcast(socket, "decision_resolved", %{
          decision: %{id: id, resolution: resolution}
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        IO.inspect(changeset, label: "changeset")

        {:reply, {:error, %{}}, socket}
    end
  end

  def handle_in("open_discussion", %{"objective" => objective}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    case Events.open_discussion(socket.assigns.event_id, objective, user.id) do
      {:ok, {:new_decision, new_decision}} ->
        broadcast(socket, "discussion_opened", %{
          status: "new",
          decision: Decisions.to_map(new_decision)
        })

        {:reply, {:ok, %{}}, socket}

      {:ok, {:updated_decision, updated_decision}} ->
        broadcast(socket, "discussion_opened", %{
          status: "updated",
          decision: Decisions.to_map(updated_decision)
        })

        {:reply, {:ok, %{}}, socket}
    end
  end
end
