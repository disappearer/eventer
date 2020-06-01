defmodule EventerWeb.EventChannel do
  use EventerWeb, :channel

  alias EventerWeb.{IdHasher, Presence}
  alias Eventer.Persistence.{Events, Users, Decisions, Messages}
  alias Eventer.Decision

  @notifier Application.get_env(:eventer_web, :notifier)

  def join("event:" <> event_id_hash, _message, socket) do
    event_id = IdHasher.decode(event_id_hash)

    event =
      event_id
      |> Events.get_event()
      |> Events.to_map()

    participant_ids = Enum.map(event.participants, &Map.get(&1, :id))

    socket =
      Phoenix.Socket.assign(socket,
        event_id: event.id,
        creator_id: event.creator.id,
        participant_ids: participant_ids
      )

    if is_participant(socket) do
      send(self(), :join_presence)
      %{id: user_id} = Guardian.Phoenix.Socket.current_resource(socket)
      Users.clear_notification_pending(user_id, event_id)

      # :ok =
      #   ChannelWatcher.monitor(
      #     self(),
      #     {__MODULE__, :leave, [event.id, user_id]}
      #   )
    end

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
    event_id = socket.assigns.event_id

    {:ok, _} = Events.join(event_id, user.id)

    broadcast(socket, "user_joined", %{user: Users.to_map(user)})

    %{participant_ids: participant_ids} = socket.assigns
    socket = assign(socket, :participant_ids, [user.id | participant_ids])

    send(self(), :join_presence)

    event = Events.get_event(event_id)

    bot_shout("#{user.name} has joined \"#{event.title}\".", socket)

    # :ok =
    #   ChannelWatcher.monitor(
    #     self(),
    #     {__MODULE__, :leave, [socket.assigns.event_id, user.id]}
    #   )
  end

  def handle_message("leave_event", %{}, socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)

    Events.leave(socket.assigns.event_id, user.id)

    broadcast(socket, "user_left", %{userId: user.id})

    event = Events.get_event(socket.assigns.event_id)

    bot_shout("#{user.name} has left \"#{event.title}\".", socket)

    {:reply, {:ok, %{}}, socket}
  end

  def handle_message("update_event", %{"event" => event_data}, socket) do
    case Events.get_event(socket.assigns.event_id)
         |> Events.update_event(event_data) do
      {:ok, _} ->
        broadcast(socket, "event_updated", %{event: event_data})

        user = Guardian.Phoenix.Socket.current_resource(socket)

        bot_shout("#{user.name} updated event name and/or description.", socket)

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

        bot_shout(
          "#{user.name} has added the \"#{decision.title}\" decision.",
          socket
        )

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("update_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "title" => title, "description" => description} = decision

    db_decision = Decisions.get_decision(id)

    case db_decision
         |> Decisions.update_decision(%{title: title, description: description}) do
      {:ok, _} ->
        broadcast(socket, "decision_updated", %{
          decision: %{id: id, title: title, description: description}
        })

        user = Guardian.Phoenix.Socket.current_resource(socket)

        bot_shout(
          "#{user.name} updated the \"#{db_decision.title}\" decision title and/or description.",
          socket
        )

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message("remove_decision", %{"decision_id" => decision_id}, socket) do
    case Decisions.get_decision(decision_id) |> Decisions.delete_decision() do
      {:ok, decision} ->
        broadcast(socket, "decision_removed", %{decision_id: decision_id})
        {:reply, {:ok, %{}}, socket}

        user = Guardian.Phoenix.Socket.current_resource(socket)

        bot_shout(
          "#{user.name} has removed the \"#{decision.title}\" decision.",
          socket
        )

      {:error, _} ->
        {:reply, {:error, %{}}, socket}
    end
  end

  def handle_message("resolve_decision", %{"decision" => decision}, socket) do
    %{"id" => id, "resolution" => resolution} = decision

    db_decision = Decisions.get_decision(id)

    case db_decision
         |> Decisions.resolve_decision(resolution) do
      {:ok, _} ->
        broadcast(socket, "decision_resolved", %{
          decision: %{id: id, resolution: resolution}
        })

        user = Guardian.Phoenix.Socket.current_resource(socket)

        bot_shout(
          "#{user.name} resolved the \"#{db_decision.title}\" decision.",
          socket
        )

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
      user = Guardian.Phoenix.Socket.current_resource(socket)

      bot_shout(
        "#{user.name} has discarded the resolution for the \"#{decision.title}\" decision.",
        socket
      )

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

        bot_shout(
          "#{user.name} has opened #{objective} for discussion.",
          socket
        )

      {:ok, {:updated_decision, updated_decision}} ->
        broadcast(socket, "discussion_opened", %{
          status: "updated",
          decision: Decisions.to_map(updated_decision)
        })

        bot_shout(
          "#{user.name} has opened #{objective} for discussion.",
          socket
        )
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

        user = Guardian.Phoenix.Socket.current_resource(socket)

        bot_shout(
          "#{user.name} has added a poll for the \"#{decision.title}\" decision.",
          socket
        )

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

      bot_shout(
        "#{user.name} voted in the \"#{decision.title}\" decision poll.",
        socket
      )
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}

      {:error, errors} ->
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message(
        "get_chat_messages_after",
        %{"after" => after_time},
        socket
      ) do
    messages =
      socket.assigns.event_id
      |> Messages.get_messages(after_time)
      |> Enum.map(&Messages.to_map/1)

    {:reply, {:ok, %{messages: messages}}, socket}
  end

  def handle_message("get_chat_messages", %{}, socket) do
    messages =
      socket.assigns.event_id
      |> Messages.get_messages()
      |> Enum.map(&Messages.to_map/1)

    {:reply, {:ok, %{messages: messages}}, socket}
  end

  def handle_message(
        "chat_shout",
        %{"text" => text, "is_bot" => is_bot},
        socket
      ) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    event_id = socket.assigns.event_id

    case Messages.insert_message(%{
           user_id: user.id,
           event_id: event_id,
           text: text,
           is_bot: is_bot
         }) do
      {:ok, message} ->
        broadcast(socket, "chat_shout", %{
          id: message.id,
          user_id: user.id,
          text: text,
          is_bot: is_bot,
          inserted_at: message.inserted_at
        })

        notification_body =
          if is_bot, do: text, else: "Someone wrote in the chat."

        notify_absent_participants(event_id, socket, notification_body)
        {:reply, {:ok, %{message: Messages.to_map(message)}}, socket}

      {:error, changeset} ->
        errors = Eventer.Persistence.Util.get_error_map(changeset)
        {:reply, {:error, %{errors: errors}}, socket}
    end
  end

  def handle_message(
        "chat_shout",
        %{"text" => text},
        socket
      ),
      do:
        handle_message(
          "chat_shout",
          %{"text" => text, "is_bot" => false},
          socket
        )

  def handle_info(:join_presence, socket) do
    push(socket, "presence_state", Presence.list(socket))
    user = Guardian.Phoenix.Socket.current_resource(socket)

    {:ok, _} =
      Presence.track(socket, user.id, %{
        online_at: inspect(System.system_time(:second))
      })

    {:noreply, socket}
  end

  # def leave(event_id, user_id),
  #   do: Users.set_last_event_visit(user_id, event_id)

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

  defp notify_absent_participants(event_id, socket, body) do
    event = Events.get_event(event_id)

    absentee_ids = get_absent_participants(event, socket)

    if not Enum.empty?(absentee_ids) do
      @notifier.notify_absent_participants(absentee_ids, event, %{
        title: "\"#{event.title}\" is active!",
        body: body
      })

      Users.set_notification_pending(absentee_ids, event_id)
    end
  end

  defp get_absent_participants(
         %{participants: participants},
         socket
       ) do
    participant_ids = Enum.map(participants, &Map.get(&1, :id))
    user = Guardian.Phoenix.Socket.current_resource(socket)

    present_participant_ids =
      Presence.list(socket)
      |> Enum.map(fn {id, _} -> Integer.parse(id) |> elem(0) end)

    Enum.filter(
      participant_ids,
      &(&1 not in [user.id | present_participant_ids])
    )
    |> filter_unnotified(socket.assigns.event_id)
  end

  defp filter_unnotified(absentee_ids, event_id) do
    Users.get_unnotified_users_ids(absentee_ids, event_id)
  end

  defp bot_shout(text, socket),
    do:
      handle_message(
        "chat_shout",
        %{"text" => text, "is_bot" => true},
        socket
      )
end
