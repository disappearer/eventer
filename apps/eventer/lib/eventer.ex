defmodule Eventer do
  alias Eventer.{User, Event, Decision, Repo}

  def insert_event(attrs) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  def insert_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def insert_decision(attrs) do
    %Decision{}
    |> Decision.standalone_changeset(attrs)
    |> Repo.insert()
  end
end
