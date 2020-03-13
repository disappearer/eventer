defmodule Eventer.Repo.Migrations.CreateUniqueParticipationsIndex do
  use Ecto.Migration

  def change do
    create(unique_index(:participations, [:event_id, :user_id]))
  end
end
