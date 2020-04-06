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
    belongs_to(:creator, Eventer.User, foreign_key: :creator_id)
    embeds_one(:poll, Eventer.Poll, on_replace: :update)
    timestamps()
  end

  def non_standalone_changeset(
        decision,
        params,
        creator_id
      ) do
    new_params = Map.put_new(params, "creator_id", creator_id)
    changeset(decision, new_params)
  end

  def standalone_changeset(decision, params \\ %{}) do
    decision
    |> changeset(params)
    |> cast(params, [:event_id])
    |> validate_required(:event_id, message: "Event must be provided")
    |> assoc_constraint(:event, message: "Event does not exist")
  end

  def changeset(decision, params \\ %{}) do
    decision
    |> cast(params, [
      :title,
      :description,
      :pending,
      :resolution,
      :objective,
      :creator_id
    ])
    |> cast_embed(:poll)
    |> validate_required(:title, message: "Title can't be blank")
    |> validate_required(:creator_id, message: "Event creator must be provided")
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> assoc_constraint(:creator, message: "Creator does not exist")
    |> unique_constraint(:title,
      name: :decisions_title_event_id_index,
      message: "Event decisions must have unique titles"
    )
    |> validate_objective()
    |> validate_resolution()
  end

  def update_changeset(decision, params \\ %{}) do
    decision
    |> cast(params, [:title, :description, :resolution, :pending])
    |> validate_required(:title, message: "Title can't be blank")
    |> cast_embed(:poll)
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
  end

  def resolve_changeset(decision, params \\ %{}) do
    decision
    |> cast(params, [:resolution, :pending])
    |> validate_required(:resolution, message: "Resolution can't be blank")
  end

  def delete_changeset(decision) do
    changeset = cast(decision, %{}, [])

    if Enum.member?(["time", "place"], decision.objective) do
      add_error(changeset, :objective, "Can't delete time or place decision")
    else
      changeset
    end
  end

  defp validate_objective(changeset) do
    changeset
    |> validate_inclusion(:objective, ["general", "time", "place"],
      message: "Objective should be one of [time, place, general]"
    )
    |> unique_constraint(:objective,
      message: "Time decision already exists for this event",
      name: "single_time_decision"
    )
    |> unique_constraint(:objective,
      message: "Place decision already exists for this event",
      name: "single_place_decision"
    )
    |> unique_constraint(:objective,
      message: "Time is already defined for this event",
      name: "event_time_already_defined"
    )
    |> unique_constraint(:objective,
      message: "Place is already defined for this event",
      name: "event_place_already_defined"
    )
  end

  defp validate_resolution(changeset) do
    case get_field(changeset, :pending) do
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
