defmodule Eventer.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add(:title, :string, null: false)
      add(:description, :string, null: false)
      add(:time, :utc_datetime)
      add(:place, :string)
      timestamps()
    end
  end
end
