defmodule Eventer.Repo.Migrations.CreateIndexUniqueTitlePerEvent do
  use Ecto.Migration

  def change do
    create unique_index(:decisions, [:title, :event_id])
  end
end
