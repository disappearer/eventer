defmodule EventerWeb.UserController do
  use EventerWeb, :controller

  def index(conn, _) do
    case Guardian.Plug.current_resource(conn) do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json", %{message: "User not found"})

      user ->
        render(conn, "user.json", %{user: user})
    end
  end
end
