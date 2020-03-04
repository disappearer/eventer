defmodule EventerWeb.UserControllerTest do
  use EventerWeb.ConnCase
  alias EventerWeb.Guardian

  @tag :authorized
  test "GET /auth/me returns user data when authorized", %{conn: conn, authorized_user: user} do
    conn =
      conn
      |> get(Routes.user_path(conn, :index))

    assert json_response(conn, 200) === %{
             "user" => %{
               "email" => user.email,
               "display_name" => user.display_name
             }
           }
  end

  test "GET /auth/me returns error when not authorized", %{conn: conn} do
    conn =
      conn
      |> get(Routes.user_path(conn, :index))

    assert json_response(conn, 401) === %{"message" => "unauthenticated"}
  end
end
