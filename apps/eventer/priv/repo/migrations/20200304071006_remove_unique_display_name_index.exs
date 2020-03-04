defmodule Eventer.Repo.Migrations.RemoveUniqueDisplayNameIndex do
  use Ecto.Migration

  def change do
    drop index(:users, [:display_name])
  end
end
