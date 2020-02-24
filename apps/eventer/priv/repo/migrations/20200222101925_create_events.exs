defmodule Eventer.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add(:title, :string, null: false)
      add(:description, :string, null: false)
      timestamps()
    end
  end
end
