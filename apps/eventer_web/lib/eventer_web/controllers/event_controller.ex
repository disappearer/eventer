defmodule EventerWeb.EventController do
  use EventerWeb, :controller

  alias Eventer.Persistence.{Events, Util}
  alias EventerWeb.IdHasher

  def create(conn, %{"event" => event}) do
    user = Guardian.Plug.current_resource(conn)
    event = Map.put_new(event, "creator_id", user.id)

    case Events.insert_event(event) do
      {:ok, event} ->
        event_id_hash = IdHasher.encode(event.id)
        render(conn, "event.json", %{event_id_hash: event_id_hash})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", %{errors: Util.get_error_map(changeset)})
    end
  end

  def index(conn, _params) do
    events =
      conn
      |> Guardian.Plug.current_resource()
      |> Events.get_events_participating()

    render(conn, "events.json", %{events: events})
  end
end
