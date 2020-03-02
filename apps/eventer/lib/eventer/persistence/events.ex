defmodule Eventer.Persistence.Events do
  alias Eventer.{Event, Participation, Repo}

  import Ecto.Query, only: [from: 2]

  def insert_event(attrs) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  def get_event(id) do
    Repo.get(Event, id)
    |> Repo.preload([:decisions, :participants])
  end

  def get_events_created_by_user(user_id) do
    query =
      from(e in Event,
        where: e.creator_id == ^user_id,
        select: e,
        order_by: e.id
      )

    Repo.all(query)
  end

  def update_event(event, attrs) do
    event
    |> Event.update_changeset(attrs)
    |> Repo.update()
  end

  def cancel_event(event) do
    update_event(event, %{cancelled: true})
  end

  def join(event_id, user_id) do
    %Participation{}
    |> Participation.changeset(%{
      user_id: user_id,
      event_id: event_id
    })
    |> Repo.insert()
  end

  def leave(event_id, user_id) do
    from(p in Participation,
      where: p.event_id == ^event_id and p.user_id == ^user_id
    )
    |> Repo.delete_all()
  end
end
