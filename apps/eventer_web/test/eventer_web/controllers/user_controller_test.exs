defmodule EventerWeb.UserControllerTest do
  use EventerWeb.ConnCase

  alias Eventer.Repo

  @tag :authorized
  test "GET /auth/me returns user data when authorized", %{
    conn: conn,
    authorized_user: user
  } do
    conn =
      conn
      |> get(Routes.user_path(conn, :index))

    assert json_response(conn, 200) === %{
             "user" => %{
               "id" => user.id,
               "email" => user.email,
               "name" => user.name
             }
           }
  end

  test "GET /auth/me returns error when not authorized", %{conn: conn} do
    conn =
      conn
      |> get(Routes.user_path(conn, :index))

    assert json_response(conn, 401) === %{"message" => "unauthenticated"}
  end

  @tag :authorized
  test "GET /auth/me returns error when user not found", %{
    conn: conn,
    authorized_user: user
  } do
    Repo.delete!(user)

    conn =
      conn
      |> get(Routes.user_path(conn, :index))

    assert json_response(conn, 401) === %{"message" => "User not found"}
  end
end
