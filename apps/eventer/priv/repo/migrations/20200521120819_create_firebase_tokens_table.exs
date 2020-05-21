defmodule Eventer.Repo.Migrations.AddFirebaseTokensTable do
  use Ecto.Migration

  def change do
    create table(:firebase_tokens) do
      add(:token, :string, null: false)
      add(:os, :string, null: false)
      add(:browser, :string, null: false)
      add(:user_id, references(:users))
      timestamps()
    end

    create(
      unique_index(:firebase_tokens, [:os, :browser, :user_id],
        name: :firebase_index
      )
    )
  end
end
