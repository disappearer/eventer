defmodule Eventer.Persistence.Users do
  alias Eventer.{User, Repo, FirebaseToken}

  import Ecto.Query

  def insert_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get(user_id) when is_binary(user_id) do
    user_id
    |> String.to_integer()
    |> get()
  end

  def get(user_id) do
    Repo.get(User, user_id)
  end

  def get_by_email(email) do
    Repo.get_by(User, %{email: email})
  end

  def insert_or_update(info) do
    case get_by_email(info.email) do
      nil -> %User{email: info.email}
      user -> user
    end
    |> User.changeset(info)
    |> Repo.insert_or_update()
  end

  def add_firebase_token(user, data) do
    %{"os" => os, "browser" => browser, "token" => token} = data
    user_id = user.id

    q =
      from(ft in FirebaseToken,
        where:
          ft.user_id == ^user_id and ft.os == ^os and
            ft.browser == ^browser
      )

    case Repo.one(q) do
      nil ->
        %FirebaseToken{}

      existing_record ->
        existing_record
    end
    |> FirebaseToken.changeset(%{
      user_id: user_id,
      os: os,
      browser: browser,
      token: token
    })
    |> Repo.insert_or_update()
  end

  def get_firebase_token(id) do
    q = from(ft in FirebaseToken, where: ft.id == ^id)
    Repo.one(q)
  end

  def to_map(%User{} = user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    }
  end
end
