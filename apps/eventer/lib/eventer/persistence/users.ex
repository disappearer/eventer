defmodule Eventer.Persistence.Users do
  alias Eventer.{User, Repo}

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

  def find_or_create(info) do
    case get_by_email(info.email) do
      %User{} = user ->
        {:ok, user}

      _ ->
        insert_user(%{
          email: info.email,
          display_name: info.name || info.email
        })
    end
  end
end
