defmodule Eventer.Repo.Migrations.AssociateCreatorWithEvent do
  use Ecto.Migration

  def change do
    alter table(:events) do
      add(:creator_id, references(:users))
    end
  end
end
