defmodule Eventer.Repo.Migrations.AddAssociationsToDecisions do
  use Ecto.Migration

  def change do
    alter table(:decisions) do
      add(:event_id, references(:events))
    end

    create(index(:decisions, [:event_id]))
  end
end
