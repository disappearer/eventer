defmodule Eventer do
  alias Eventer.{User, Repo}

  def insert_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end
end
