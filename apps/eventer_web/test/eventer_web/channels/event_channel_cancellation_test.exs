defmodule EventerWeb.EventChannelCancellationTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Event, Repo}

  describe "Event cancellation" do
    @tag authorized: 1
    test "'cancel_event' updates the event in DB", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(socket, "cancel_event", %{})

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:creator)

      {changes, _, _} = diff(event, updated_event, [:updated_at])

      assert changes === [
               {[:cancelled], false, true}
             ]
    end
  end

  @tag authorized: 1
  test "'event_cancelled' is broadcasted", %{
    connections: [%{user: user, socket: socket}]
  } do
    event = insert_event(%{creator: user})
    event_id_hash = IdHasher.encode(event.id)

    {:ok, _, socket} =
      subscribe_and_join(
        socket,
        EventChannel,
        "event:#{event_id_hash}"
      )

    push(socket, "cancel_event", %{})

    assert_broadcast("event_cancelled", %{})

    assert_broadcast("chat_shout", payload)
    assert payload.is_bot === true

    assert payload.text ===
             "#{user.name} cancelled the event."
  end

  @tag authorized: 1
  test "'reactivate_event' un-cancels the event", %{
    connections: [%{user: user, socket: socket}]
  } do
    event = insert_event(%{creator: user})
    event_id_hash = IdHasher.encode(event.id)

    {:ok, _, socket} =
      subscribe_and_join(
        socket,
        EventChannel,
        "event:#{event_id_hash}"
      )

    ref = push(socket, "cancel_event", %{})

    assert_reply(ref, :ok, %{})

    cancelled_event = Repo.get(Event, event.id) |> Repo.preload(:creator)

    {changes, _, _} = diff(event, cancelled_event, [:updated_at])

    assert changes === [
             {[:cancelled], false, true}
           ]

    ref = push(socket, "reactivate_event", %{})

    assert_reply(ref, :ok, %{})

    reactivated_event = Repo.get(Event, event.id) |> Repo.preload(:creator)

    {changes, _, _} = diff(cancelled_event, reactivated_event, [:updated_at])

    assert changes === [
             {[:cancelled], true, false}
           ]
  end

  @tag authorized: 1
  test "'event_reactivated' is broadcasted", %{
    connections: [%{user: user, socket: socket}]
  } do
    event = insert_event(%{creator: user})
    event_id_hash = IdHasher.encode(event.id)

    {:ok, _, socket} =
      subscribe_and_join(
        socket,
        EventChannel,
        "event:#{event_id_hash}"
      )

    push(socket, "reactivate_event", %{})

    assert_broadcast("event_reactivated", %{})

    assert_broadcast("chat_shout", payload)
    assert payload.is_bot === true

    assert payload.text ===
             "#{user.name} reactivated the event."
  end

  @tag authorized: 2
  test "all actions are disabled on cancelled event, except for the logical ones",
       %{
         connections: [%{user: creator}, %{socket: socket}]
       } do
    event = insert_event(%{creator: creator})
    event_id_hash = IdHasher.encode(event.id)

    {:ok, _, socket} =
      subscribe_and_join(
        socket,
        EventChannel,
        "event:#{event_id_hash}"
      )

    allowed_messages = [
      "join_event",
      "cancel_event",
      "get_chat_messages",
      {"get_chat_messages_after", %{"after" => Timex.now()}},
      "chat_is_typing",
      {"chat_shout", %{text: "Hell World!"}}
    ]

    Enum.each(allowed_messages, fn
      {message, payload} ->
        ref = push(socket, message, payload)
        assert_reply(ref, :ok, _)

      message ->
        ref = push(socket, message, %{})
        assert_reply(ref, :ok, _)
    end)

    not_allowed_messages = [
      "cancel_event",
      "update_event",
      "add_decision",
      "update_decision",
      "remove_decision",
      "resolve_decision",
      "discard_resolution",
      "open_discussion",
      "add_poll",
      "remove_poll",
      "vote"
    ]

    Enum.each(not_allowed_messages, fn message ->
      ref = push(socket, message, %{})

      assert_reply(ref, :error, %{
        errors: "Can't perform this action on cancelled event"
      })
    end)

    ref = push(socket, "leave_event", %{})
    assert_reply(ref, :ok, %{})
  end
end
