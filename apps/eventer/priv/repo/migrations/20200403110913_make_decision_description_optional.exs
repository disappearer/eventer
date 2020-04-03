defmodule Eventer.Repo.Migrations.MakeDecisionDescriptionOptional do
  use Ecto.Migration

  def change do
    alter table("decisions") do
      modify(:description, :string, null: true)
    end
  end
end
