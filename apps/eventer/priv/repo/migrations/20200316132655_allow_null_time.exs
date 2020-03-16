defmodule Eventer.Repo.Migrations.AllowNullTime do
  use Ecto.Migration

  def change do
    alter table("events") do
      modify :time, :utc_datetime, null: true
    end
  end
end
