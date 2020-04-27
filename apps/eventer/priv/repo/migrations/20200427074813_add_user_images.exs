defmodule Eventer.Repo.Migrations.AddUserImages do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :image, :string
    end
  end
end
