defmodule EventerWeb.EventControllerCreateTest do
  use EventerWeb.ConnCase
  alias EventerWeb.IdHasher
  alias Eventer.Persistence.Events

  describe "Event create" do
    @tag :authorized
    test "POST /api/events returns hashed id", %{
      conn: conn,
      authorized_user: user
    } do
      event_data = %{
        title: "test title",
        description: "test description",
        time: TestUtil.tomorrow(),
        place: "there"
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event_data})

      %{"event_id_hash" => event_id_hash} = json_response(conn, 200)

      event_id = IdHasher.decode(event_id_hash)
      db_event = Events.get_event(event_id)
      merged_event = Map.merge(db_event, event_data)

      assert merged_event === db_event
      assert db_event.creator_id === user.id
    end

    @tag :authorized
    @tag :wip
    test "POST /api/events without time, but with time decision", %{
      conn: conn,
      authorized_user: user
    } do
      event_data = %{
        title: "test title",
        description: "test description",
        place: "there",
        decisions: [
          %{
            title: "time decision",
            description: "we need to decide",
            objective: "time"
          }
        ]
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event_data})

      user_id = user.id

      %{"event_id_hash" => event_id_hash} = json_response(conn, 200)

      event_id = IdHasher.decode(event_id_hash)
      db_event = Events.get_event(event_id)

      assert %{decisions: [%{id: _, objective: "time", creator_id: ^user_id}]} =
               db_event
    end

    @tag :authorized
    @tag :wip
    test "POST /api/events without place, but with place decision", %{
      conn: conn,
      authorized_user: user
    } do
      event_data = %{
        title: "test title",
        description: "test description",
        time: TestUtil.tomorrow(),
        decisions: [
          %{
            title: "time decision",
            description: "we need to decide",
            objective: "place"
          }
        ]
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event_data})

      user_id = user.id

      %{"event_id_hash" => event_id_hash} = json_response(conn, 200)

      event_id = IdHasher.decode(event_id_hash)
      db_event = Events.get_event(event_id)

      assert %{decisions: [%{id: _, objective: "place", creator_id: ^user_id}]} =
               db_event
    end

    @tag :authorized
    test "POST /api/events fails when missing time", %{conn: conn} do
      event = %{
        title: "test title",
        description: "test description",
        place: "there"
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event})

      assert json_response(conn, 422) === %{
               "errors" => %{"time" => ["No time or time decision specified"]}
             }
    end

    @tag :authorized
    test "POST /api/events fails when missing place", %{conn: conn} do
      event = %{
        title: "test title",
        description: "test description",
        time: TestUtil.tomorrow()
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event})

      assert json_response(conn, 422) === %{
               "errors" => %{
                 "place" => ["No place or place decision specified"]
               }
             }
    end

    @tag :authorized
    test "POST /api/events fails when missing title", %{conn: conn} do
      event = %{
        description: "test description",
        time: TestUtil.tomorrow(),
        place: "there"
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event})

      assert json_response(conn, 422) === %{
               "errors" => %{"title" => ["Title can't be blank"]}
             }
    end

    @tag :authorized
    test "POST /api/events fails when missing description", %{conn: conn} do
      event = %{
        title: "test title",
        time: TestUtil.tomorrow(),
        place: "there"
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event})

      assert json_response(conn, 422) === %{
               "errors" => %{"description" => ["Description can't be blank"]}
             }
    end

    @tag :authorized
    test "POST /api/events with time and with time decision", %{conn: conn} do
      event_data = %{
        title: "test title",
        description: "test description",
        place: "there",
        time: TestUtil.tomorrow(),
        decisions: [
          %{
            title: "time decision",
            description: "we need to decide",
            objective: "time"
          }
        ]
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event_data})

      assert json_response(conn, 422) === %{
               "errors" => %{
                 "decisions" => [
                   %{"objective" => ["Time is already defined for this event"]}
                 ]
               }
             }
    end

    @tag :authorized
    test "POST /api/events with place and with place decision", %{conn: conn} do
      event_data = %{
        title: "test title",
        description: "test description",
        place: "there",
        time: TestUtil.tomorrow(),
        decisions: [
          %{
            title: "place decision",
            description: "we need to decide",
            objective: "place"
          }
        ]
      }

      conn =
        conn
        |> post(Routes.event_path(conn, :create), %{event: event_data})

      assert json_response(conn, 422) === %{
               "errors" => %{
                 "decisions" => [
                   %{"objective" => ["Place is already defined for this event"]}
                 ]
               }
             }
    end

    test "POST /api/events returns error when not authorized", %{conn: conn} do
      conn =
        conn
        |> post(Routes.event_path(conn, :create))

      assert json_response(conn, 401) === %{"message" => "unauthenticated"}
    end
  end
end
