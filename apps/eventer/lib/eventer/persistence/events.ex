defmodule Eventer.Persistence.Events do
  alias Eventer.{User, Event, Participation, Repo}

  alias Eventer.Persistence.{Users, Decisions}

  import Ecto.Query, only: [from: 2]

  def insert_event(attrs) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  def get_event(id) do
    Repo.get(Event, id)
    |> Repo.preload([:creator, :decisions, :participants])
  end

  def get_events_created_by_user(%User{} = user) do
    query =
      from(e in Event,
        where: e.creator_id == ^user.id,
        select: e,
        order_by: e.id
      )

    Repo.all(query)
  end

  def get_events_participating(%User{} = user) do
    query =
      from(e in Event,
        left_join: p in assoc(e, :participants),
        where: p.id == ^user.id or e.creator_id == ^user.id,
        order_by: [desc: e.time]
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

  def to_map(%Event{} = event) do
    %{
      id: event.id,
      title: event.title,
      description: event.description,
      time: event.time,
      place: event.place,
      creator: Users.to_map(event.creator),
      decisions: Enum.map(event.decisions, &Decisions.to_map/1),
      participants: Enum.map(event.participants, &Users.to_map/1)
    }
  end
end
