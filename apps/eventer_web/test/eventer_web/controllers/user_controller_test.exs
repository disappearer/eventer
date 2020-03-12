defmodule EventerWeb.UserControllerTest do
  use EventerWeb.ConnCase

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
               "displayName" => user.display_name
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
