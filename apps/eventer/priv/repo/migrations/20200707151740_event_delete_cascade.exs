defmodule Eventer.Repo.Migrations.EventDeleteCascade do
  use Ecto.Migration

  def up do
    drop(constraint(:decisions, "decisions_event_id_fkey"))

    alter table(:decisions) do
      modify(:event_id, references(:events, on_delete: :delete_all))
    end
  end

  def down do
    drop(constraint(:decisions, "decisions_event_id_fkey"))

    alter table(:decisions) do
      modify(:event_id, references(:events, on_delete: :nothing))
    end
  end
end
