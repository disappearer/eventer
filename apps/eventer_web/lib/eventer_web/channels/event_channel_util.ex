defmodule EventerWeb.EventChannelUtil do
  alias EventerWeb.{Presence}
  alias Eventer.Persistence.{Events, Users, Decisions}
  alias EventerWeb.EventChannel

  @notifier Application.get_env(:eventer_web, :notifier)

  # def leave(event_id, user_id),
  #   do: Users.set_last_event_visit(user_id, event_id)

  def get_participation_status(socket) do
    user = Guardian.Phoenix.Socket.current_resource(socket)
    %{event: event} = socket.assigns
    %{participants: participants, creator: creator} = event
    participant_ids = Enum.map(participants, &Map.get(&1, :id))

    if user.id === creator.id || Enum.member?(participant_ids, user.id) do
      :is_participant
    else
      :not_participant
    end
  end

  def is_participant(socket),
    do: get_participation_status(socket) === :is_participant

  def get_event_status(socket) do
    if socket.assigns.event.cancelled do
      :event_cancelled
    else
      :event_active
    end
  end

  def is_allowed(message, socket) do
    case get_event_status(socket) do
      :event_active ->
        true

      :event_cancelled ->
        message in [
          "chat_shout",
          "reactivate_event",
          "chat_is_typing",
          "leave_event"
        ] ||
          :not_allowed_cancelled
    end
  end

  def check_multiple_vote(decision, options) do
    cond do
      length(options) < 2 ->
        {:ok, nil}

      decision.poll.multiple_answers_enabled ->
        {:ok, nil}

      true ->
        {:error, %{vote: "Voting for multiple options is disabled"}}
    end
  end

  def add_custom_option(decision, custom_option) do
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

  def append_custom_option(options, _decision, nil), do: {options, nil}

  def append_custom_option(options, decision, _custom_option) do
    new_option = List.last(decision.poll.options)
    {[new_option.id | options], new_option}
  end

  def notify_absent_participants(event_id, socket, body) do
    event = Events.get_event(event_id)

    absentee_ids = get_absent_participants(event, socket)

    if not Enum.empty?(absentee_ids) do
      if Application.get_env(:eventer_web, :notifications_enabled) do
        Task.start_link(fn ->
          @notifier.notify_absent_participants(absentee_ids, event, %{
            title: "\"#{event.title}\" is active!",
            body: body
          })

          Users.set_notification_pending(absentee_ids, event_id)
        end)
      end
    end
  end

  def get_absent_participants(
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
    |> filter_unnotified(socket.assigns.event.id)
  end

  def filter_unnotified(absentee_ids, event_id) do
    Users.get_unnotified_users_ids(absentee_ids, event_id)
  end

  def bot_shout(text, socket),
    do:
      EventChannel.handle_message(
        "chat_shout",
        %{"text" => text, "is_bot" => true},
        socket
      )
end
