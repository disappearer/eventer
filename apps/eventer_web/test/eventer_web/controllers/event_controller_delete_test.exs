defmodule EventerWeb.EventControllerDeleteTest do
  use EventerWeb.ConnCase
  alias EventerWeb.IdHasher
  alias Eventer.Persistence.{Events, Decisions}

  describe "Event delete" do
    @tag :authorized
    test "DELETE /api/events removes the event from DB", %{
      conn: conn,
      authorized_user: user
    } do
      decisions = insert_list(3, :decision, %{creator: user})
      event = insert(:event, %{creator: user, decisions: decisions})
      id_hash = IdHasher.encode(event.id)

      conn =
        conn
        |> delete(Routes.event_path(conn, :delete, id_hash))

      %{"event_id_hash" => event_id_hash} = json_response(conn, 200)

      assert event_id_hash === id_hash

      db_event = Events.get_event(event.id)
      assert db_event === nil

      Enum.each(decisions, fn decision ->
        d = Decisions.get_decision(decision.id)
        assert d === nil
      end)
    end

    @tag :authorized
    test "DELETE /api/events fails if event has participants", %{
      conn: conn,
      authorized_user: user
    } do
      event = insert(:event, %{creator: user})
      id_hash = IdHasher.encode(event.id)

      participant = insert(:user)
      insert(:participation, %{user: participant, event: event})

      conn =
        conn
        |> delete(Routes.event_path(conn, :delete, id_hash))

      assert json_response(conn, 400) === %{
               "errors" =>
                 "Can't delete event that has or has had participants."
             }

      db_event = Events.get_event(event.id)
      assert db_event !== nil
    end
  end
end
