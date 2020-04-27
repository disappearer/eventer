defmodule Eventer.Repo.Migrations.RenameUsersName do
  use Ecto.Migration

  def change do
    rename table("users"), :display_name, to: :name
  end
end
