defmodule Persistence.DecisionsUpdateTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Decisions}
  alias Eventer.Decision
  alias Eventer.Repo

  describe "Decision update" do
    setup do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      {:ok, decision} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "general"
        })

      %{decision: decision}
    end

    test "title and description", %{decision: decision} do
      attrs = %{
        title: "new title",
        description: "new description"
      }

      {:ok, _} = Decisions.update_decision(decision, attrs)
      updated_decision = Repo.get(Decision, decision.id)

      assert updated_decision |> Map.drop([:updated_at]) ===
               Map.merge(decision, attrs) |> Map.drop([:updated_at])
    end

    test "includes resolving", %{decision: decision} do
      resolution = "This is what we decided"
      assert decision.resolution === nil
      assert decision.pending
      {:ok, _} = Decisions.resolve_decision(decision, resolution)
      resolved_decision = Repo.get(Decision, decision.id)
      assert resolved_decision.resolution === resolution
      refute resolved_decision.pending
    end

    test "includes discarding resolution", %{decision: decision} do
      {:ok, resolved_decision} = Decisions.resolve_decision(decision, "test")

      refute resolved_decision.pending
      refute resolved_decision.resolution === nil

      {:ok, _} = Decisions.discard_resolution(resolved_decision)
      unresolved_decision = Repo.get(Decision, decision.id)
      assert unresolved_decision.resolution === nil
      assert unresolved_decision.pending
    end
  end
end
