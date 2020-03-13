defmodule Eventer.Persistence.Events do
  alias Eventer.{User, Event, Participation, Repo}

  alias Eventer.Persistence.{Users, Decisions}

  import Ecto.Query

  def insert_event(attrs) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  def get_event(id) do
    Repo.get(Event, id)
    |> Repo.preload([:creator, :decisions])
    |> preload_participation_assocs()
  end

  def preload_participation_assocs(nil), do: nil

  def preload_participation_assocs(event) do
    event
    |> Repo.preload(participants: participants_query_left(event.id, false))
    |> Repo.preload(ex_participants: participants_query_left(event.id, true))
  end

  defp participants_query_left(event_id, has_left) do
    from(
      u in User,
      join: p in Participation,
      on: u.id == p.user_id,
      where: p.has_left == ^has_left and p.event_id == ^event_id
    )
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
        left_join: p in Participation,
        on: p.event_id == e.id,
        where:
          (p.has_left == false and
             p.user_id == ^user.id) or
            e.creator_id == ^user.id,
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
    case Repo.get_by(Participation, event_id: event_id, user_id: user_id) do
      nil ->
        %Participation{}
        |> Participation.changeset(%{
          user_id: user_id,
          event_id: event_id,
        })
        |> Repo.insert()

      participation ->
        participation
        |> Participation.changeset(%{has_left: false})
        |> Repo.update()
    end
  end

  def leave(event_id, user_id) do
    from(p in Participation,
      where: p.event_id == ^event_id and p.user_id == ^user_id,
      update: [set: [has_left: true]]
    )
    |> Repo.update_all([])
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
      participants: Enum.map(event.participants, &Users.to_map/1),
      exParticipants: Enum.map(event.ex_participants, &Users.to_map/1)
    }
  end
end
