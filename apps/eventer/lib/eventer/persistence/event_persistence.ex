defmodule Eventer.Persistence.EventPersistence do
  alias Eventer.{Event, Repo}

  import Ecto.Query, only: [from: 2]

  def insert(attrs) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  def get(id) do
    Repo.get(Event, id)
    |> Repo.preload(:decisions)
  end

  def get_created_by_user(user_id) do
    query = from e in Event,
            where: e.creator_id == ^user_id,
            select: e,
            order_by: e.id

    Repo.all(query)
  end

  def update(event_id, attrs) do
    %Event{id: event_id}
    |> Event.update_changeset(attrs)
    |> Repo.update()
  end

  def cancel(event_id) do
    update(event_id, %{cancelled: true})
  end
end
