defmodule EventerWeb.EventChannelResolveTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Event, Repo}

  describe "Decision resolving" do
    @tag authorized: 1
    test "'resolve_decision' updates the general decision", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
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
      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:pending], true, false},
               {[:resolution], nil, resolution}
             ]
    end

    @tag authorized: 1
    test "'decision_resolved' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
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
    test "'resolve_decision' for time decision updates the event time", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user, time: nil})

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
      event = insert(:event, %{creator: user, place: nil})

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
end
