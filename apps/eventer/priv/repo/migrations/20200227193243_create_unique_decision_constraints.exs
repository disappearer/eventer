defmodule Eventer.Repo.Migrations.CreateUniqueDecisionConstraints do
  use Ecto.Migration

  def change do
    create(
      unique_index(:decisions, [:event_id, :objective],
        name: "single_time_decision",
        where: "objective = 'time'"
      )
    )

    create(
      unique_index(:decisions, [:event_id, :objective],
        name: "single_place_decision",
        where: "objective = 'place'"
      )
    )
  end
end
