defmodule Eventer.Repo.Migrations.CreateUniqueDisplayNameConstraint do
  use Ecto.Migration

  def change do
    create unique_index(:users, [:display_name])
  end
end
