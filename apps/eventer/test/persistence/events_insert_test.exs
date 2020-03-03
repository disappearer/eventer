defmodule Persistence.EventsInsertTest do
  use Eventer.DataCase
  import Ecto.Query

  alias Eventer.{Event, Repo}
  alias Eventer.Persistence.{Events, Users}

  describe "Event insert" do
    setup do
      {:ok, user} =
        Users.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      %{user: user}
    end

    test "success", %{user: user} do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      assert Repo.one(count_query) == before_count + 1
    end


    test "success - without time and with time decisions", %{user: user} do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          place: "nowhere",
          decisions: [
            %{
              title: "time decision",
              description: "we need to decide",
              objective: "time"
            }
          ]
        })

      assert Repo.one(count_query) == before_count + 1
    end

    test "success - without place and with place decisions", %{
      user: user
    } do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          decisions: [
            %{
              title: "place decision",
              description: "we need to decide",
              objective: "place"
            }
          ]
        })

      assert Repo.one(count_query) == before_count + 1
    end

    test "without creator id fails" do
      {:error, changeset} =
        Events.insert_event(%{
          # creator_id: user.id
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      {message, _} = Keyword.get(changeset.errors, :creator_id)
      assert message === "Creator has to be specified"
    end

    test "if creator doesn't exist fails" do
      {:error, changeset} =
        Events.insert_event(%{
          creator_id: 1000,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      {message, _} = Keyword.get(changeset.errors, :creator)
      assert message === "User does not exist"
    end

    test "without time fails", %{user: user} do
      {:error, changeset} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          place: "nowhere"
        })

      assert Keyword.get(changeset.errors, :time) ===
               {"No time or time decision specified", []}
    end

    test "without place fails", %{user: user} do
      {:error, changeset} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow()
        })

      assert Keyword.get(changeset.errors, :place) ===
               {"No place or place decision specified", []}
    end

    test "without title fails" do
      {:error, changeset} =
        Events.insert_event(%{
          description: "test description",
          time: tomorrow(),
          place: "somewhere"
        })

      assert Keyword.get(changeset.errors, :title) ===
               {"Title can't be blank", [{:validation, :required}]}
    end

    test "without description fails" do
      {:error, changeset} =
        Events.insert_event(%{
          title: "test title",
          time: tomorrow(),
          place: "somewhere"
        })

      assert Keyword.get(changeset.errors, :description) ===
               {"Description can't be blank", [{:validation, :required}]}
    end

    test "can't have both time defined and a pending time decision", %{
      user: user
    } do
      {:error, changeset} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test title",
          description: "test description",
          time: tomorrow(),
          place: "somewhere",
          decisions: [
            %{
              title: "time decision",
              description: "when?",
              objective: "time"
            }
          ]
        })

      {message, _} =
        changeset
        |> Map.get(:changes)
        |> Map.get(:decisions)
        |> List.first()
        |> Map.get(:errors)
        |> Keyword.get(:objective)

      assert message ===
               "Time is already defined for this event"
    end

    test "can't have both place defined and a pending place decision", %{
      user: user
    } do
      {:error, changeset} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test title",
          description: "test description",
          time: tomorrow(),
          place: "somewhere",
          decisions: [
            %{
              title: "place decision",
              description: "when?",
              objective: "place"
            }
          ]
        })

      {message, _} =
        changeset
        |> Map.get(:changes)
        |> Map.get(:decisions)
        |> List.first()
        |> Map.get(:errors)
        |> Keyword.get(:objective)

      assert message ===
               "Place is already defined for this event"
    end
  end
end