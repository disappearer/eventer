defmodule Eventer do
  alias Eventer.{Event, Repo}

  def insert_event(attrs) do
    %Event{}
    |> Event.create_changeset(attrs)
    |> Repo.insert()
  end
end
