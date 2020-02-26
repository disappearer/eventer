defmodule Eventer.Repo.Migrations.AddDecisionCreator do
  use Ecto.Migration

  def change do
    alter table(:decisions) do
      add(:creator_id, references(:users))
    end

    execute """
      UPDATE decisions
      SET creator_id = events.creator_id
      FROM events
      WHERE decisions.event_id = events.id
    """
  end
end
