defmodule Eventer.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field(:title, :string)
    field(:description, :string)
    field(:time, :utc_datetime)
    field(:place, :string)
    field(:cancelled, :boolean, default: false)
    has_many(:decisions, Eventer.Decision, on_replace: :delete)
    belongs_to(:creator, Eventer.User, foreign_key: :creator_id)
    timestamps()
  end

  def changeset(event, params \\ %{}) do
    event
    |> cast(params, [:title, :description, :time, :place, :creator_id])
    |> validate_required(:title, message: "Title can't be blank")
    |> validate_required(:description, message: "Description can't be blank")
    |> validate_required(:creator_id, message: "Creator has to be specified")
    |> assoc_constraint(:creator, message: "User does not exist")
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
    |> validate_change(:time, &is_in_future/2)
    |> validate_and_cast_decisions()
  end

  def update_changeset(event, params \\ %{}) do
    event
    |> cast(params, [:title, :description, :cancelled])
    |> validate_length(:title, min: 3)
    |> validate_length(:description, max: 200)
  end

  defp is_in_future(:time, time) do
    case DateTime.compare(time, DateTime.utc_now()) do
      :lt -> [time: "time of the event cannot be in the past"]
      _ -> []
    end
  end

  defp validate_and_cast_decisions(changeset) do
    event_time = get_field(changeset, :time)
    event_place = get_field(changeset, :place)
    creator_id = get_field(changeset, :creator_id)

    changeset
    |> cast_assoc(:decisions,
      with:
        {Eventer.Decision, :non_standalone_changeset,
         [creator_id]}
    )
    |> validate_objective(event_time, :time)
    |> validate_objective(event_place, :place)
  end

  defp validate_objective(changeset, event_value, objective) do
    if not is_nil(event_value) or
         any_decision_has_objective?(changeset, objective) do
      changeset
    else
      add_error(
        changeset,
        objective,
        "No #{objective} or #{objective} decision specified"
      )
    end
  end

  defp any_decision_has_objective?(changeset, objective) do
    changeset
    |> get_field(:decisions)
    |> Enum.any?(fn decision ->
      Map.get(decision, :objective) === Atom.to_string(objective)
    end)
  end
end
