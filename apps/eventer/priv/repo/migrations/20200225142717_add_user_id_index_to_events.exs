defmodule Eventer.Repo.Migrations.AddUserIdIndexToEvents do
  use Ecto.Migration

  def change do
    create(index(:events, [:creator_id]))
  end
end
