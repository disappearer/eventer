defmodule Eventer.Repo.Migrations.AddEventCancelledField do
  use Ecto.Migration

  def change do
    alter table("events") do
      add :cancelled, :boolean
    end
  end
end
