defmodule Eventer.Repo.Migrations.RenameLeftToHasLeft do
  use Ecto.Migration

  def change do
    rename table("participations"), :left, to: :has_left
  end
end
