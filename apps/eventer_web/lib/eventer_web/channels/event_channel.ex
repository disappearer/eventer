defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.{IdHasher, Presence}
  alias Eventer.Persistence.{Events, Users, Decisions, Messages}
  alias Eventer.Decision

  @notifier Application.get_env(:eventer_web, :notifier)

  def join("event:" <> event_id_hash, _message, socket) do
    event =
      event_id_hash
      |> IdHasher.decode()
      |> Events.get_event()
      |> Events.to_map()

    participant_ids = Enum.map(event.participants, &Map.get(&1, :id))

    socket =
      Phoenix.Socket.assign(socket,
        event_id: event.id,
        creator_id: event.creator.id,
        participant_ids: participant_ids
      )

    if is_participant(socket), do: send(self(), :join_presence)

    {:ok, %{event: event}, socket}
  end

  def handle_in("join_event", %{}, socket),
    do: handle_message("join_event", %{}, socket)

  def handle_in("get_chat_messages", %{}, socket),
    do: handle_message("get_chat_messages", %{}, socket)

  def handle_in(message, payload, socket) do
    if is_participant(socket) do
      handle_message(message, payload, socket)
    else
      {:reply,
       {:error,
        %{
          errors: %{
            permissions: "This action is not allowed for non-participants"
          }
        }}, socket}
    end
  end

  def handle_message("join_event", %{}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    {:ok, _} = Events.join(socket.assigns.event_id, user.id)

    broadcast(socket, "user_joined", %{user: Users.to_map(user)})

    %{participant_ids: participant_ids} = socket.assigns
    socket = assign(socket, :participant_ids, [user.id | participant_ids])

    send(self(), :join_presence)

    {:reply, {:ok, %{}}, socket}
  end

  def handle_message("leave_event", %{}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    Events.leave(socket.assigns.event_id, user.id)

    broadcast(socket, "user_left", %{userId: user.id})
    {:reply, {:ok, %{}}, socket}
  end

  def handle_message("update_event", %{"event" => event_data}, socket) do
    case Events.get_event(socket.assigns.event_id)
         |> Events.update_event(event_data) do
      {:ok, _} ->
        broadcast(socket, "event_updated", %{event: event_data})
        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("add_decision", %{"decision" => data}, socket) do
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
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("update_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "title" => title, "description" => description} = decision

    case Decisions.get_decision(id)
         |> Decisions.update_decision(%{title: title, description: description}) do
      {:ok, _} ->
        broadcast(socket, "decision_updated", %{
          decision: %{id: id, title: title, description: description}
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("remove_decision", %{"decision_id" => decision_id}, socket) do
    case Decisions.get_decision(decision_id) |> Decisions.delete_decision() do
      {:ok, _} ->
        broadcast(socket, "decision_removed", %{decision_id: decision_id})
        {:reply, {:ok, %{}}, socket}

      {:error, _} ->
        {:reply, {:error, %{}}, socket}
    end
  end

  def handle_message("resolve_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "resolution" => resolution} = decision

    case Decisions.get_decision(id)
         |> Decisions.resolve_decision(resolution) do
      {:ok, _} ->
        broadcast(socket, "decision_resolved", %{
          decision: %{id: id, resolution: resolution}
        })

        {:reply, {:ok, %{}}, socket}

      {:error, changeset} ->
        errors =
          case Eventer.Persistence.Util.get_error_map(changeset) do
            %{time: time_error_message} ->
              %{resolution: time_error_message}

            error_map ->
              error_map
          end

        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("discard_resolution", %{"decision_id" => id}, socket) do
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

  def handle_message("open_discussion", %{"objective" => objective}, socket) do
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

  def handle_message(
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
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message(
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
      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}

      {:error, errors} ->
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("get_chat_messages", %{}, socket) do
    messages =
      socket.assigns.event_id
      |> Messages.get_messages()
      |> Enum.map(&Messages.to_map/1)

    {:reply, {:ok, %{messages: messages}}, socket}
  end

  def handle_message("chat_shout", %{"text" => text}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    event_id = socket.assigns.event_id

    case Messages.insert_message(%{
           user_id: user.id,
           event_id: event_id,
           text: text
         }) do
      {:ok, message} ->
        broadcast(socket, "chat_shout", %{
          id: message.id,
          user_id: user.id,
          text: text,
          inserted_at: message.inserted_at
        })

        notify_absent_participants(event_id, socket)
        {:reply, {:ok, %{message: Messages.to_map(message)}}, socket}

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_info(:join_presence, socket) do
    push(socket, "presence_state", Presence.list(socket))
    user = Guardian.Phoenix.Socket.current_resource(socket)

    {:ok, _} =
      Presence.track(socket, user.id, %{
        online_at: inspect(System.system_time(:second))
      })

    {:noreply, socket}
  end

  defp is_participant(socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    %{creator_id: creator_id, participant_ids: participant_ids} = socket.assigns

    user.id === creator_id || Enum.member?(participant_ids, user.id)
  end

  defp check_multiple_vote(decision, options) do
    cond do
      length(options) < 2 ->
        {:ok, nil}

      decision.poll.multiple_answers_enabled ->
        {:ok, nil}

      true ->
        {:error, %{vote: "Voting for multiple options is disabled"}}
    end
  end

  defp add_custom_option(decision, custom_option) do
    if custom_option do
      with true <- decision.poll.custom_answer_enabled,
           {:error, changeset} <-
             Decisions.add_option(decision, custom_option["text"]),
           %{options: options_errors} <-
             Eventer.Persistence.Util.get_error_map(changeset),
           %{text: "Has a duplicate"} <- List.last(options_errors) do
        {:error, %{customOption: "Answer already exists"}}
      else
        false -> {:error, %{vote: "Poll fixed - custom option not possible"}}
        result -> result
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

  defp notify_absent_participants(event_id, socket) do
    event = Events.get_event(event_id)

    get_absent_participants(event, socket)
    |> @notifier.notify_absent_participants(event,  %{
      title: "'#{event.title}' is active!",
      body: "Someone wrote in the event chat."
    })
  end

  defp get_absent_participants(
         %{participants: participants, creator_id: creator_id},
         socket
       ) do
    participant_ids = [creator_id | Enum.map(participants, &Map.get(&1, :id))]

    present_participant_ids =
      Presence.list(socket)
      |> Enum.map(fn {id, _} -> Integer.parse(id) |> elem(0) end)

    Enum.filter(participant_ids, &(&1 not in present_participant_ids))
  end
end
