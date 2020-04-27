defmodule Persistence.DecisionsDeleteTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Decisions, Users}
  alias Eventer.Repo

  describe "Decision delete" do
    setup do
      {:ok, user} =
        Users.insert_user(%{
          email: "test@example.com",
          name: "Test User"
        })

      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      %{user: user, event: event}
    end

    test "success", %{event: event, user: user} do
      {:ok, decision} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "general"
        })

      {:ok, _} = Decisions.delete_decision(decision)
      assert Repo.get(Eventer.Decision, decision.id) === nil
    end

    test "fail if time decision", %{user: user} do
      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          place: "nowhere",
          decisions: [
            %{
              "title" => "test decision 1",
              "description" => "test description",
              "objective" => "time"
            }
          ]
        })

      [decision] = event.decisions

      {:error, changeset} = Decisions.delete_decision(decision)
      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Can't delete time or place decision"
    end

    test "fail if place decision", %{user: user} do
      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          decisions: [
            %{
              "title" => "test decision 1",
              "description" => "test description",
              "objective" => "place"
            }
          ]
        })

      [decision] = event.decisions

      {:error, changeset} = Decisions.delete_decision(decision)
      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Can't delete time or place decision"
    end
  end
end
