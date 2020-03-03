defmodule Eventer.Persistence.Users do
  alias Eventer.{User, Repo}

  def insert_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get_by_email(email) do
    Repo.get_by(User, %{email: email})
  end
end
