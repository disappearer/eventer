defmodule Eventer.Decision do
  use Ecto.Schema
  import Ecto.Changeset

  schema "decisions" do
    field(:title, :string)
    field(:description, :string)
    field(:pending, :boolean, default: true)
    field(:resolution, :string)
    field(:objective, :string, default: "general")
    belongs_to(:event, Eventer.Event)
    has_one(:poll, Eventer.Poll)
    timestamps()
  end

  def changeset(decision, params \\ %{}) do
    decision
    |> cast(params, [:title, :description, :pending, :resolution, :objective])
    |> validate_required(:title, message: "Title can't be blank")
    |> validate_required(:description, message: "Description can't be blank")
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> validate_inclusion(:objective, ["general", "time", "place"],
      message: "Objective should be one of [time, place, general]"
    )
    |> validate_resolution()
  end

  def standalone_changeset(decision, params \\ %{}) do
    decision
    |> changeset(params)
    |> cast(params, [:event_id])
    |> validate_required(:event_id, message: "Event must be provided")
    |> assoc_constraint(:event, message: "Event does not exist")
  end

  defp validate_resolution(changeset) do
    case fetch_change(changeset, :pending) do
      {:ok, false} ->
        changeset
        |> validate_required(:resolution,
          message: "can't be blank if not pending"
        )

      _ ->
        changeset
    end
  end
end
