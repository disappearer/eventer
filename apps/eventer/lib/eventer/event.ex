defmodule Eventer.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field(:title, :string)
    field(:description, :string)
    field(:time, :utc_datetime)
    field(:place, :string)
    has_many(:decisions, Eventer.Decision, on_replace: :delete)
    belongs_to(:user, Eventer.User, foreign_key: :creator_id)
    timestamps()
  end

  def changeset(item, params \\ %{}) do
    item
    |> cast(params, [:title, :description, :time, :place, :creator_id])
    |> cast_assoc(:decisions)
    |> validate_required(:title, message: "Title can't be blank")
    |> validate_required(:description, message: "Description can't be blank")
    |> validate_required(:creator_id, message: "Creator has to be specified")
    |> assoc_constraint(:user, message: "User does not exist")
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> validate_change(:time, &is_in_future/2)
    |> validate_decisions()
  end

  defp is_in_future(:time, time) do
    case DateTime.compare(time, DateTime.utc_now()) do
      :lt -> [time: "time of the event cannot be in the past"]
      _ -> []
    end
  end

  defp validate_decisions(changeset) do
    changeset
    |> validate_decisions(:time)
    |> validate_decisions(:place)
  end

  defp validate_decisions(changeset, objective) do
    case {Map.get(changeset.data, objective),
          Map.get(changeset.changes, objective)} do
      {nil, nil} -> validate_decision_objective(changeset, objective)
      _ -> changeset
    end
  end

  defp validate_decision_objective(changeset, objective) do
    if decisions_objectives_valid?(changeset, objective) do
      changeset
    else
      add_error(
        changeset,
        objective,
        "No #{objective} or #{objective} decision specified"
      )
    end
  end

  defp decisions_objectives_valid?(changeset, objective) do
    existing_decisions = Map.get(changeset.data, :decisions)
    new_decisions = Map.get(changeset.changes, :decisions)

    case {has_objective?(existing_decisions, objective), new_decisions} do
      {true, nil} -> true
      _ -> has_objective?(new_decisions, objective)
    end
  end

  defp has_objective?(decisions, objective) do
    case decisions do
      nil ->
        false

      %Ecto.Association.NotLoaded{} ->
        false

      [%Ecto.Changeset{} | _] = changesets ->
        Enum.any?(changesets, fn changeset ->
          Map.get(changeset.changes, :objective) === Atom.to_string(objective)
        end)

      _ ->
        Enum.any?(decisions, fn decision ->
          Map.get(decision, :objective) === Atom.to_string(objective)
        end)
    end
  end
end
