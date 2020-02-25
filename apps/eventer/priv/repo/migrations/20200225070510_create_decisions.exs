defmodule Eventer.Repo.Migrations.CreateDecisions do
  use Ecto.Migration

  def change do
    create table(:decisions) do
      add(:title, :string, null: false)
      add(:description, :string, null: false)
      add(:objective, :string)
      add(:pending, :boolean)
      add(:resolution, :string)
      timestamps()
    end
  end
end
