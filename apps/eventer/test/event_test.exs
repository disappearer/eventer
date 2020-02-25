defmodule EventTest do
  use Eventer.DataCase
  import Ecto.Query

  # doctest Eventer

  alias Eventer.{Event, Repo}

  describe "Event" do
    test "insert success" do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Eventer.insert_event(%{
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      assert Repo.one(count_query) == before_count + 1
    end

    test "insert success - without time and with time decisions" do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Eventer.insert_event(%{
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

    test "insert success - without place and with place decisions" do
      count_query = from(e in Event, select: count(e.id))
      before_count = Repo.one(count_query)

      {:ok, _item} =
        Eventer.insert_event(%{
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

    test "insert without time fails" do
      {:error, changeset} =
        Eventer.insert_event(%{
          title: "test event",
          description: "test description",
          place: "nowhere"
        })

      assert Keyword.get(changeset.errors, :time) ===
               {"No time or time decision specified", []}
    end

    test "insert without place fails" do
      {:error, changeset} =
        Eventer.insert_event(%{
          title: "test event",
          description: "test description",
          time: tomorrow()
        })

      assert Keyword.get(changeset.errors, :place) ===
               {"No place or place decision specified", []}
    end

    test "insert without title fails" do
      {:error, changeset} =
        Eventer.insert_event(%{
          description: "test description",
          time: tomorrow(),
          place: "somewhere"
        })

      assert Keyword.get(changeset.errors, :title) ===
               {"Title can't be blank", [{:validation, :required}]}
    end

    test "insert without description fails" do
      {:error, changeset} =
        Eventer.insert_event(%{
          title: "test title",
          time: tomorrow(),
          place: "somewhere"
        })

      assert Keyword.get(changeset.errors, :description) ===
               {"Description can't be blank", [{:validation, :required}]}
    end
  end
end
