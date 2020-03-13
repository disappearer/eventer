defmodule EventerWeb.EventChannelResolveTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Repo}

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
  end
end
