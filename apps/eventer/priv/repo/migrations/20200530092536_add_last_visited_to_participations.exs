defmodule Eventer.Repo.Migrations.AddLastVisitedToParticipations do
  use Ecto.Migration

  def change do
    alter table("participations") do
      add :last_visited, :utc_datetime
    end
  end
end
