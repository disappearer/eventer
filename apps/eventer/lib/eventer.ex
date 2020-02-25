defmodule Eventer do
  alias Eventer.{Event, User, Repo}

  def insert_event(attrs) do
    %Event{}
    |> Event.create_changeset(attrs)
    |> Repo.insert()
  end


  def insert_user(attrs) do
    %User{}
    |> User.create_changeset(attrs)
    |> Repo.insert()
  end
end
