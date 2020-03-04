defmodule EventerWeb.UserController do
  use EventerWeb, :controller

  def index(conn, _) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, "user.json", %{user: user})
  end
end
