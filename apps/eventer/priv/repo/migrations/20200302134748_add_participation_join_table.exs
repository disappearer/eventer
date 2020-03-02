defmodule Eventer.Repo.Migrations.AddParticipationJoinTable do
  use Ecto.Migration

  def change do
    create table(:participations, primary_key: false) do
      add(:user_id, references(:users))
      add(:event_id, references(:events))
      add(:watcher, :boolean)
      timestamps()
    end
  end
end
