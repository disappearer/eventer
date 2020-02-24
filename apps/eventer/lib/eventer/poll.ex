defmodule Eventer.Poll do
  use Ecto.Schema
  import Ecto.Changeset

  schema "polls" do
    field(:question, :string)
    field(:kind, :string)
    field(:fixed, :boolean)
    field(:answers, {:array, :map})
    field(:autoresolve, :boolean)
    field(:options, {:array, :string})
    belongs_to(:event, Eventer.Event)
    has_one(:poll, Eventer.Poll)
    timestamps()
  end

  def changeset(item, params \\ %{}) do
    item
    |> cast(params, [:title, :description, :pending, :resolution, :objective])
    |> validate_required([:title, :description])
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> validate_inclusion(:objective, ["general", "time", "place"])
  end
end
