defmodule Eventer.Participation do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "participations" do
    field(:watcher, :boolean, default: false)
    belongs_to(:user, Eventer.User)
    belongs_to(:event, Eventer.Event)
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:user_id, :event_id])
    |> validate_required([:user_id, :event_id])
    |> assoc_constraint(:user, message: "User does not exist")
    |> assoc_constraint(:event, message: "Event does not exist")
  end
end
