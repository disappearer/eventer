defmodule Eventer.Participation do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "participations" do
    field(:watcher, :boolean, default: false)
    field(:has_left, :boolean, default: false)
    field(:last_visited, :utc_datetime)
    belongs_to(:user, Eventer.User, primary_key: true)
    belongs_to(:event, Eventer.Event, primary_key: true)
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:user_id, :event_id, :has_left, :last_visited])
    |> validate_required([:user_id, :event_id])
    |> assoc_constraint(:user, message: "User does not exist")
    |> assoc_constraint(:event, message: "Event does not exist")
  end
end
