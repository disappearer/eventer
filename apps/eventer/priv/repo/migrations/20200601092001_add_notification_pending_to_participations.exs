defmodule Eventer.Repo.Migrations.AddNotificationPendingToParticipations do
  use Ecto.Migration

  def change do
    alter table("participations") do
      add(:notification_pending, :boolean)
    end
  end
end
