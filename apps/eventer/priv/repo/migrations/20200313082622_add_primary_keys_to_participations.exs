defmodule Eventer.Repo.Migrations.AddPrimaryKeysToParticipations do
  use Ecto.Migration

  def change do
    alter table(:participations) do
      modify(:user_id, :integer, primary_key: true)
      modify(:event_id, :integer, primary_key: true)
    end
  end
end
