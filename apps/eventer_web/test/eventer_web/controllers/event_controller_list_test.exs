defmodule EventerWeb.EventControllerListTest do
  use EventerWeb.ConnCase
  alias EventerWeb.IdHasher

  describe "Event list" do
    @tag :authorized
    test "GET /api/events returns user's events sorted by time descending", %{
      conn: conn,
      authorized_user: user
    } do
      events =
        insert_list(3, :event, %{creator: user})
        |> Enum.sort(fn e1, e2 ->
          DateTime.compare(e1.time, e2.time) === :gt
        end)

      timeless_event = insert_event(%{creator: user, time: nil})
      regular_event = insert_event(%{creator: user})
      events = [timeless_event | [regular_event | events]]

      conn =
        conn
        |> get(Routes.event_path(conn, :index))

      %{"events" => response_events} = json_response(conn, 200)

      Enum.zip(events, response_events)
      |> Enum.each(fn {event, response_event} ->
        assert event.title === response_event["title"]
        assert event.place === response_event["place"]
        assert event.id === IdHasher.decode(response_event["id_hash"])

        if is_nil(event.time) do
          assert response_event["time"] === nil
        else
          {:ok, response_time, _} =
            DateTime.from_iso8601(response_event["time"])

          assert event.time === response_time
        end
      end)
    end

    @tag :authorized
    test "GET /api/events returns empty list if user has no events", %{
      conn: conn
    } do
      conn =
        conn
        |> get(Routes.event_path(conn, :index))

      %{"events" => response_events} = json_response(conn, 200)
      assert response_events === []
    end

    test "GET /api/events returns error when not authorized", %{conn: conn} do
      conn =
        conn
        |> get(Routes.event_path(conn, :index))

      assert json_response(conn, 401) === %{"message" => "unauthenticated"}
    end
  end
end
