defmodule EventerWeb.UserController do
  use EventerWeb, :controller

  alias Eventer.Persistence.{Users, Util}

  def index(conn, _) do
    case Guardian.Plug.current_resource(conn) do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json", %{errors: "User not found"})

      user ->
        render(conn, "user.json", %{user: user})
    end
  end

  def add_firebase_token(conn, %{"data" => data}) do
    user = Guardian.Plug.current_resource(conn)

    case Users.add_firebase_token(user, data) do
      {:ok, token_data} ->
        render(conn, "firebase_token.json", %{id: token_data.id})

      {:error, changeset} ->
        IO.inspect changeset, label: "changeset"
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", %{errors: Util.get_error_map(changeset)})
    end
  end
end
