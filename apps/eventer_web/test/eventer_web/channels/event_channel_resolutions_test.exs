defmodule EventerWeb.EventChannelResolveTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Event, Repo}

  describe "Decision resolving" do
    @tag authorized: 1
    test "'resolve_decision' updates the general decision", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = "This is what we decided"

      ref =
        push(socket, "resolve_decision", %{
          decision: %{
            id: decision.id,
            resolution: resolution
          }
        })

      assert_reply(ref, :ok, %{})

      updated_decision = Repo.get(Decision, decision.id)
      {changes, _, _} = diff(decision, updated_decision, [:updated_at])

      assert changes === [
               {[:pending], true, false},
               {[:resolution], nil, resolution}
             ]
    end

    @tag authorized: 1
    test "'decision_resolved' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = "This is what we decided"

      data = %{
        decision: %{
          id: decision.id,
          resolution: resolution
        }
      }

      push(socket, "resolve_decision", data)

      assert_broadcast("decision_resolved", payload)

      assert payload === data
    end

    @tag authorized: 1
    test "'resolve_decision' fails if empty resolution", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = ""

      ref =
        push(socket, "resolve_decision", %{
          decision: %{
            id: decision.id,
            resolution: resolution
          }
        })

      assert_reply(ref, :error, %{errors: errors})
      assert errors === %{resolution: "Resolution can't be blank"}
    end

    @tag authorized: 1
    test "'resolve_decision' for time decision updates the event time", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user, time: nil})

      decision =
        insert(:decision, %{event: event, creator: user, objective: "time"})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = TestUtil.tomorrow() |> DateTime.to_iso8601()

      ref =
        push(socket, "resolve_decision", %{
          decision: %{
            id: decision.id,
            resolution: resolution
          }
        })

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id)
      {:ok, time, _} = DateTime.from_iso8601(resolution)
      assert updated_event.time === time
    end

    @tag authorized: 1
    test "'resolve_decision' for place decision updates the event place", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user, place: nil})

      decision =
        insert(:decision, %{event: event, creator: user, objective: "place"})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = "Everywhere"

      ref =
        push(socket, "resolve_decision", %{
          decision: %{
            id: decision.id,
            resolution: resolution
          }
        })

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id)
      assert updated_event.place === resolution
    end
  end

  describe "Decision resolution discarding" do
    @tag authorized: 1
    test "'discard_resolution' updates the general decision", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      resolution = "Some resolution"

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          pending: false,
          resolution: resolution
        })

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref =
        push(socket, "discard_resolution", %{
          decision_id: decision.id
        })

      assert_reply(ref, :ok, %{})

      updated_decision = Repo.get(Decision, decision.id)
      {changes, _, _} = diff(decision, updated_decision, [:updated_at])

      assert changes === [
               {[:pending], false, true},
               {[:resolution], resolution, nil}
             ]
    end

    @tag authorized: 1
    test "'decision_resolved' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
      resolution = "Some resolution"

      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          pending: false,
          resolution: resolution
        })

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(socket, "discard_resolution", %{
        decision_id: decision.id
      })

      assert_broadcast("resolution_discarded", payload)

      assert payload === %{decision_id: decision.id}
    end

    @tag authorized: 1
    test "'discard_resolution' fails if objective not 'general'", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user, time: nil})
      decision =
        insert(:decision, %{
          event: event,
          creator: user,
          pending: false,
          objective: "time",
          resolution: "some time"
        })

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref =
        push(socket, "discard_resolution", %{
          decision_id: decision.id
        })

      assert_reply(ref, :error, %{error: "Cannot discard non-general decision"})
    end

    @tag authorized: 1
    test "'resolve_decision' for time decision fails if time in the past", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user, time: nil})

      decision =
        insert(:decision, %{event: event, creator: user, objective: "time"})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      resolution = TestUtil.days_in_past(1) |> DateTime.to_iso8601()

      ref =
        push(socket, "resolve_decision", %{
          decision: %{
            id: decision.id,
            resolution: resolution
          }
        })

      assert_reply(ref, :error, %{errors: errors})
      assert errors === %{resolution: "Time of the event cannot be in the past"}
    end
  end
end
