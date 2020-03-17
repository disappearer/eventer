defmodule EventerWeb.EventChannelOpenDiscussionTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Event, Decision, Repo}
  alias Eventer.Persistence.Decisions

  describe "Open for discussion" do
    @tag authorized: 1
    test "'open_discussion' for event time makes time nil",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(socket, "open_discussion", %{objective: "time"})

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id)
      assert updated_event.time === nil
    end

    @tag authorized: 1
    test "'open_discussion' with no existing time decision broadcasts new decision",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(socket, "open_discussion", %{objective: "time"})

      assert_broadcast("discussion_opened", %{new_decision: new_decision})
      assert new_decision.event_id === event.id
      assert new_decision.objective === "time"
      assert new_decision.pending === true
      assert new_decision.resolution === nil
    end

    @tag authorized: 1
    test "'open_discussion' with existing time decision broadcasts updated decision",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user, time: nil})

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          objective: "time"
        })

      time = TestUtil.tomorrow() |> DateTime.to_iso8601()
      Decisions.resolve_decision(decision, time)
      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(socket, "open_discussion", %{objective: "time"})

      assert_broadcast("discussion_opened", %{
        updated_decision: updated_decision
      })

      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:pending], false, true},
               {[:resolution], time, nil}
             ]
    end

    @tag authorized: 1
    test "'open_discussion' for event place makes place nil",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(socket, "open_discussion", %{objective: "place"})

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:decisions)

      assert updated_event.place === nil
    end

    @tag authorized: 1
    test "'open_discussion' with no existing place decision broadcasts new decision",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(socket, "open_discussion", %{objective: "place"})

      assert_broadcast("discussion_opened", %{new_decision: new_decision})
      assert new_decision.event_id === event.id
      assert new_decision.objective === "place"
      assert new_decision.pending === true
      assert new_decision.resolution === nil
    end

    @tag authorized: 1
    test "'open_discussion' with existing place decision broadcasts updated decision",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user, place: nil})

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          objective: "place"
        })

      place = "Some place"
      Decisions.resolve_decision(decision, place)
      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(socket, "open_discussion", %{objective: "place"})

      assert_broadcast("discussion_opened", %{
        updated_decision: updated_decision
      })

      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:pending], false, true},
               {[:resolution], place, nil}
             ]
    end
  end
end
