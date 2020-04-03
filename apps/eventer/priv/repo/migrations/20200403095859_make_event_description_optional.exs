defmodule Eventer.Repo.Migrations.MakeEventDescriptionOptional do
  use Ecto.Migration

  def change do
    alter table("events") do
      modify(:description, :string, null: true)
    end
  end
end
