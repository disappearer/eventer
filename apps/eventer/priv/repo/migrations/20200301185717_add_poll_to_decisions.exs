defmodule Eventer.Repo.Migrations.AddPollToDecisions do
  use Ecto.Migration

  def change do
    alter table("decisions") do
      add :poll, :map
    end
  end
end
