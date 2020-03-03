defmodule EventerWeb.PageControllerTest do
  use EventerWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Welcome to Phoenix!"
  end

  @tag :skip
  test "remove this at once" do
    user = insert(:user)
    insert(:event, creator: user)
    insert(:event, creator: user)
    insert(:event, creator: user)
    insert(:event, creator: user)
    user = user |> Eventer.Repo.preload(:events_created)
    IO.inspect(user, label: "user")
  end
end
