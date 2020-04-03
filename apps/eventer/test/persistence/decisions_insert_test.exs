defmodule Persistence.DecisionsInsertTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Decisions, Users}

  describe "Decision insert" do
    setup do
      {:ok, user} =
        Users.insert_user(%{
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

      %{user: user, event: event}
    end

    test "success", %{event: event, user: user} do
      {:ok, decision} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "general",
          poll: %{
            question: "What?"
          }
        })

      assert decision.id !== nil
    end

    test "without creator_id fails", %{event: event} do
      {:error, changeset} =
        Decisions.insert_decision(%{
          event_id: event.id,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      assert Keyword.get(changeset.errors, :creator_id) ===
               {"Event creator must be provided", [{:validation, :required}]}
    end

    test "fails when creator doesn't exist", %{event: event} do
      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: 420,
          event_id: event.id,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :creator)
      assert message === "Creator does not exist"
    end

    test "without title fails", %{event: event} do
      {:error, changeset} =
        Decisions.insert_decision(%{
          event_id: event.id,
          description: "test description",
          objective: "general"
        })

      assert Keyword.get(changeset.errors, :title) ===
               {"Title can't be blank", [{:validation, :required}]}
    end

    test "objective can't be other than [time, place, general]", %{event: event} do
      {:error, changeset} =
        Decisions.insert_decision(%{
          event_id: event.id,
          title: "test title",
          description: "test description",
          objective: "wrong objective"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Objective should be one of [time, place, general]"
    end

    test "insert without event_id" do
      {:error, changeset} =
        Decisions.insert_decision(%{
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :event_id)
      assert message === "Event must be provided"
    end

    test "event must exist", %{user: user} do
      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: 420,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :event)
      assert message === "Event does not exist"
    end

    @tag :wip
    test "title is unique per event", %{event: event, user: user} do
      {:ok, _item} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "general"
        })

      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :title)
      assert message === "Event decisions must have unique titles"
    end

    test "only one time objective per event", %{user: user} do
      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          place: "nowhere",
          decisions: [
            %{
              "title" => "test decision",
              "description" => "test description",
              "objective" => "time"
            }
          ]
        })

      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "time"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Time decision already exists for this event"
    end

    test "only one place objective per event", %{user: user} do
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

      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 2",
          description: "test description",
          objective: "place"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Place decision already exists for this event"
    end

    test "insert with time objective fails when event time defined", %{
      user: user,
      event: event
    } do
      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "time"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Time is already defined for this event"
    end

    test "insert with place objective fails when event place defined", %{
      user: user,
      event: event
    } do
      {:error, changeset} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "place"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Place is already defined for this event"
    end
  end
end
