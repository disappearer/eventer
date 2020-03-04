defmodule EventerWeb.AuthController do
  use EventerWeb, :controller
  plug(Ueberauth)

  alias Eventer.Persistence.Users
  alias EventerWeb.Guardian

  @ten_days 10 * 24 * 60 * 60

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case Users.find_or_create(auth.info) do
      {:ok, user} ->
        {:ok, token, _} = Guardian.encode_and_sign(user)

        conn
        |> put_resp_cookie("token", token,
          max_age: @ten_days,
          http_only: false
        )
        |> redirect(to: Routes.page_path(conn, :index))

      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/")
    end

    conn
    |> put_flash(:info, "Auth Success. Hello #{auth.info.first_name}!")
    |> redirect(to: Routes.page_path(conn, :index))
  end

  def callback(conn, _params) do
    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: Routes.page_path(conn, :index))
  end

  def logout(conn, _) do
    conn
    |> delete_resp_cookie("token", http_only: false)
    |> put_flash(:info, "You have logged out")
    |> redirect(to: Routes.page_path(conn, :index))
  end
end
