defmodule Eventer.Repo.Migrations.AddLeftToParticipations do
  use Ecto.Migration

  def change do
    alter table("participations") do
      add :left, :boolean
    end
  end
end
