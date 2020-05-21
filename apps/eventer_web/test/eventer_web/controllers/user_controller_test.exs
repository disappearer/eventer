defmodule EventerWeb.UserControllerTest do
  use EventerWeb.ConnCase

  alias Eventer.Repo
  alias Eventer.Persistence.Users

  @tag :authorized
  test "GET /me returns user data when authorized", %{
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

  test "GET /me returns error when not authorized", %{conn: conn} do
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

    assert json_response(conn, 401) === %{"errors" => "User not found"}
  end

  @tag :authorized
  test "POST /api/me/firebase_token returns created record id", %{
    conn: conn,
    authorized_user: user
  } do
    data = %{
      token: "firebase token",
      os: "linux",
      browser: "firefox"
    }

    conn =
      conn
      |> post(Routes.user_path(conn, :add_firebase_token), %{data: data})

    %{"id" => token_record_id} = json_response(conn, 200)

    db_token = Users.get_firebase_token(token_record_id)
    merged_token = Map.merge(db_token, data)

    assert merged_token === db_token
    assert db_token.user_id === user.id
  end

  @tag :authorized
  test "POST /api/me/firebase_token with same os,browser,user gets updated", %{
    conn: conn
  } do
    data = %{
      token: "firebase token",
      os: "linux",
      browser: "firefox"
    }

    conn =
      conn
      |> post(Routes.user_path(conn, :add_firebase_token), %{data: data})

    %{"id" => token_record_id1} = json_response(conn, 200)
    db_token1 = Users.get_firebase_token(token_record_id1)

    conn =
      conn
      |> post(Routes.user_path(conn, :add_firebase_token), %{
        data: %{data | token: "different token"}
      })

    %{"id" => token_record_id2} = json_response(conn, 200)

    db_token2 = Users.get_firebase_token(token_record_id2)
    {changes, _, _} = diff(db_token1, db_token2, [:updated_at])

    assert changes === [{[:token], "firebase token", "different token"}]
  end

  @tag :authorized
  test "POST /api/me/firebase_token with different os creates new record", %{
    conn: conn
  } do
    data = %{
      token: "firebase token",
      os: "linux",
      browser: "firefox"
    }

    conn =
      conn
      |> post(Routes.user_path(conn, :add_firebase_token), %{data: data})

    %{"id" => token_record_id1} = json_response(conn, 200)
    db_token1 = Users.get_firebase_token(token_record_id1)

    conn =
      conn
      |> post(Routes.user_path(conn, :add_firebase_token), %{
        data: %{data | os: "android"}
      })

    %{"id" => token_record_id2} = json_response(conn, 200)

    db_token2 = Users.get_firebase_token(token_record_id2)
    {changes, _, _} = diff(db_token1, db_token2, [:updated_at])

    [{[:id], id1, id2}, {[:os], "linux", "android"}] = changes
    assert id1 !== id2
  end
end
