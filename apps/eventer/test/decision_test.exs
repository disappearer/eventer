defmodule DecisionTest do
  use Eventer.DataCase
  import Ecto.Query

  # doctest Eventer

  alias Eventer.{Decision, Repo}
  alias Eventer.Persistence.EventPersistence

  describe "Decision" do
    setup do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        EventPersistence.insert(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      %{event: event, user: user}
    end

    test "insert success (general)", %{event: event, user: user} do
      count_query = from(d in Decision, select: count(d.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Eventer.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "general"
        })

      assert Repo.one(count_query) == before_count + 1
    end

    test "insert without creator_id fails", %{event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          event_id: event.id,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      assert Keyword.get(changeset.errors, :creator_id) ===
               {"Event creator must be provided", [{:validation, :required}]}
    end

    test "insert fails when creator doesn't exist", %{event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          creator_id: 420,
          event_id: event.id,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :creator)
      assert message === "Creator does not exist"
    end

    test "insert without title fails", %{event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          event_id: event.id,
          description: "test description",
          objective: "general"
        })

      assert Keyword.get(changeset.errors, :title) ===
               {"Title can't be blank", [{:validation, :required}]}
    end

    test "insert without description fails", %{event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          event_id: event.id,
          title: "test title",
          objective: "general"
        })

      assert Keyword.get(changeset.errors, :description) ===
               {"Description can't be blank", [{:validation, :required}]}
    end

    test "objective can't be other than [time, place, general]", %{event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
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
        Eventer.insert_decision(%{
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :event_id)
      assert message === "Event must be provided"
    end

    test "event must exist", %{user: user} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          creator_id: user.id,
          event_id: 420,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :event)
      assert message === "Event does not exist"
    end

    test "title is unique per event", %{event: event, user: user} do
      {:ok, _item} =
        Eventer.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "general"
        })

      {:error, changeset} =
        Eventer.insert_decision(%{
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
        EventPersistence.insert(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          place: "nowhere",
          decisions: [
            %{
              title: "test decision",
              description: "test description",
              objective: "time"
            }
          ]
        })

      {:error, changeset} =
        Eventer.insert_decision(%{
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
        EventPersistence.insert(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          decisions: [
            %{
              title: "test decision",
              description: "test description",
              objective: "place"
            }
          ]
        })

      {:error, changeset} =
        Eventer.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "place"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Place decision already exists for this event"
    end

    test "insert with time objective fails when event time defined", %{user: user, event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "time"
        })

      {message, _} = Keyword.get(changeset.errors, :objective)
      assert message === "Time is already defined for this event"
    end

    @tag :wip
    test "insert with place objective fails when event place defined", %{user: user, event: event} do
      {:error, changeset} =
        Eventer.insert_decision(%{
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
