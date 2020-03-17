defmodule EventerWeb.EventChannelOpenDiscussionTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Event, Decision, Repo}
  alias Eventer.Persistence.Decisions

  describe "Open for discussion" do
    @tag authorized: 1
    test "'open_discussion' for event time creates time decision and makes time null",
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

      assert_reply(ref, :ok, %{new_decision: new_decision})

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:decisions)

      assert updated_event.time === nil
      assert new_decision.objective === "time"
    end

    @tag authorized: 1
    test "'open_discussion' for event place creates place decision and makes place null",
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

      assert_reply(ref, :ok, %{new_decision: new_decision})

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:decisions)

      assert updated_event.place === nil
      assert new_decision.objective === "place"
    end

    @tag authorized: 1
    test "'open_discussion' for event time updates existing time decision and makes time null",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      time = TestUtil.tomorrow() |> DateTime.to_iso8601()
      event = insert(:event, %{creator: user, time: nil})

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          objective: "time"
        })

      Decisions.resolve_decision(decision, time)

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(socket, "open_discussion", %{objective: "time"})

      assert_reply(ref, :ok, %{updated_decision: updated_decision})
      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:pending], false, true},
               {[:resolution], time, nil}
             ]

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:decisions)
      assert updated_event.time === nil
    end

    @tag authorized: 1
    test "'open_discussion' for event place updates existing place decision and makes place null",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      place = "Some place"
      event = insert(:event, %{creator: user, place: nil})

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          objective: "place"
        })

      Decisions.resolve_decision(decision, place)

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(socket, "open_discussion", %{objective: "place"})

      assert_reply(ref, :ok, %{updated_decision: updated_decision})
      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:pending], false, true},
               {[:resolution], place, nil}
             ]

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:decisions)
      assert updated_event.place === nil
    end
  end
end
