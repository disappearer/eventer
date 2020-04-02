defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.IdHasher
  alias Eventer.Persistence.{Events, Users, Decisions}
  alias Eventer.Decision

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

  def handle_in("add_decision", %{"decision" => data}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    event_id = socket.assigns.event_id

    result =
      data
      |> Map.put_new("creator_id", user.id)
      |> Map.put_new("event_id", event_id)
      |> Decisions.insert_decision()

    case result do
      {:ok, decision} ->
        broadcast(socket, "decision_added", %{
          decision: Decisions.to_map(decision)
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        IO.inspect(changeset, label: "changeset")
        {:reply, {:error, %{}}, socket}
    end
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

  def handle_in("remove_decision", %{"decision_id" => decision_id}, socket) do
    case Decisions.get_decision(decision_id) |> Decisions.delete_decision() do
      {:ok, _} ->
        broadcast(socket, "decision_removed", %{decision_id: decision_id})
        {:reply, {:ok, %{}}, socket}

      {:error, _} ->
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

  def handle_in("discard_resolution", %{"decision_id" => id}, socket) do
    with %{objective: "general"} = decision <- Decisions.get_decision(id),
         {:ok, _} <- Decisions.discard_resolution(decision) do
      broadcast(socket, "resolution_discarded", %{decision_id: id})

      {:reply, {:ok, %{}}, socket}
    else
      {:error, changeset} ->
        IO.inspect(changeset, label: "changeset")

        {:reply, {:error, %{}}, socket}

      %Decision{} ->
        {:reply, {:error, %{error: "Cannot discard non-general decision"}},
         socket}

      _ ->
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

  def handle_in(
        "add_poll",
        %{"decision_id" => decision_id, "poll" => poll},
        socket
      ) do
    case Decisions.get_decision(decision_id) |> Decisions.update_poll(poll) do
      {:ok, decision} ->
        broadcast(socket, "poll_added", %{
          decision_id: decision.id,
          poll: Polls.to_map(decision.poll)
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        IO.inspect(changeset, label: "changeset")
        {:reply, {:error, %{errors: changeset.errors}}, socket}
    end
  end

  def handle_in(
        "vote",
        %{
          "decision_id" => decision_id,
          "custom_option" => custom_option,
          "options" => options
        },
        socket
      )
      when is_list(options) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    decision = Decisions.get_decision(decision_id)

    with {:ok, _} <- check_multiple_vote(decision, options),
         {:ok, decision} <- add_custom_option(decision, custom_option),
         {options, new_option} <-
           append_custom_option(options, decision, custom_option),
         {:ok, _} <- Decisions.vote(decision, user.id, options) do
      broadcast(socket, "user_voted", %{
        user_id: user.id,
        decision_id: decision.id,
        custom_option: Polls.option_to_map(new_option),
        options: options
      })

      {:reply, {:ok, %{}}, socket}
    else
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset.errors}}, socket}
    end
  end

  defp check_multiple_vote(decision, options) do
    cond do
      length(options) < 2 ->
        {:ok, nil}

      decision.poll.multiple_votes ->
        {:ok, nil}

      true ->
        {:error,
         %{errors: [vote: {"Voting for multiple options is disabled", []}]}}
    end
  end

  defp add_custom_option(decision, custom_option) do
    if custom_option do
      if decision.poll.fixed do
        {:error,
         %{errors: [vote: {"Poll fixed - custom option not possible", []}]}}
      else
        Decisions.add_option(decision, custom_option["text"])
      end
    else
      {:ok, decision}
    end
  end

  defp append_custom_option(options, _decision, nil), do: {options, nil}

  defp append_custom_option(options, decision, _custom_option) do
    new_option = List.last(decision.poll.options)
    {[new_option.id | options], new_option}
  end
end
