defmodule DecisionTest do
  use Eventer.DataCase
  import Ecto.Query

  # doctest Eventer

  alias Eventer.{Decision, Repo}

  describe "Decision" do
    setup do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        Eventer.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      %{event: event}
    end

    test "insert success (general, time, place)", %{event: event} do
      count_query = from(d in Decision, select: count(d.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Eventer.insert_decision(%{
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "general"
        })

      assert Repo.one(count_query) == before_count + 1

      {:ok, _item} =
        Eventer.insert_decision(%{
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "time"
        })

      assert Repo.one(count_query) == before_count + 2

      {:ok, _item} =
        Eventer.insert_decision(%{
          event_id: event.id,
          title: "test decision",
          description: "test description",
          objective: "place"
        })

      assert Repo.one(count_query) == before_count + 3
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

    test "event must exist" do
      {:error, changeset} =
        Eventer.insert_decision(%{
          event_id: 420,
          title: "test title",
          description: "test description",
          objective: "general"
        })

      {message, _} = Keyword.get(changeset.errors, :event)
      assert message === "Event does not exist"
    end
  end
end
