defmodule EventerWeb.EventChannelUpdateDecisionTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Repo}

  describe "Decision update" do
    @tag authorized: 1
    test "'update_decision' title, description - success", %{
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

      new_title = "New Title"
      new_description = "New Description"

      ref =
        push(socket, "update_decision", %{
          decision: %{
            id: decision.id,
            title: new_title,
            description: new_description
          }
        })

      assert_reply(ref, :ok, %{})

      updated_decision = Repo.get(Decision, decision.id)
      {changes, _, _} = diff(decision, updated_decision)

      assert changes === [
               {[:description], decision.description, new_description},
               {[:title], decision.title, new_title}
             ]
    end

    @tag authorized: 1
    test "'decision_updated' is broadcasted", %{
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

      data = %{
        decision: %{
          id: decision.id,
          title: "New Title",
          description: "New Description"
        }
      }

      push(socket, "update_decision", data)

      assert_broadcast("decision_updated", payload)

      assert payload === data
    end
  end
end