defmodule Eventer.Repo.Migrations.CreateMessagesTable do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add(:text, :string, null: false)
      add(:user_id, references(:users))
      add(:event_id, references(:events))
      timestamps()
    end

    create(index(:messages, [:event_id]))
  end
end
