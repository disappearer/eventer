defmodule Eventer.Repo.Migrations.AddIsBotToMessages do
  use Ecto.Migration

  def change do
    alter table("messages") do
      add(:is_bot, :boolean)
    end
  end
end
