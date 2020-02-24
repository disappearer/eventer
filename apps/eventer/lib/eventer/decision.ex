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

  def changeset(item, params \\ %{}) do
    item
    |> cast(params, [:title, :description, :pending, :resolution, :objective])
    |> validate_required([:title, :description])
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> validate_inclusion(:objective, ["general", "time", "place"])
    |> validate_resolution()
  end

  defp validate_resolution(changeset) do
    case fetch_change(changeset, :pending) do
      {:ok, false} ->
        changeset |> validate_required(:resolution, message: "can't be blank if not pending")

      _ ->
        changeset
    end
  end
end
