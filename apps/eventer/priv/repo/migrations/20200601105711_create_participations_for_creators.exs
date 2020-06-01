defmodule Eventer.Repo.Migrations.CreateParticipationsForCreators do
  alias Eventer.{Event, Participation, Repo}
  use Ecto.Migration
  import Ecto.Query

  def up do
    query =
      from(e in Event,
        select: [e.id, e.creator_id],
        order_by: e.id
      )

    events = Repo.all(query)
    IO.inspect(events, label: "events")

    entries =
      Enum.map(events, fn [event_id, creator_id] ->
        %{
          event_id: event_id,
          user_id: creator_id,
          has_left: false,
          inserted_at:
            NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second),
          updated_at: NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)
        }
      end)

    Repo.insert_all(Participation, entries)
  end

  def down do
    query =
      from(e in Event,
        select: [e.id, e.creator_id],
        order_by: e.id
      )

    events = Repo.all(query)

    Repo.transaction(fn ->
      Enum.each(events, fn [event_id, creator_id] ->
        case Repo.get_by(Participation, %{
               event_id: event_id,
               user_id: creator_id
             })
             |> Repo.delete() do
          {:ok, _} -> :ok
          {:error, changeset} -> Repo.rollback(changeset)
        end
      end)
    end)
  end
end
