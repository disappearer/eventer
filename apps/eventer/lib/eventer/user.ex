defmodule Eventer.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Eventer.{Event, Participation}

  schema "users" do
    field(:email, :string)
    field(:name, :string)
    field(:image, :string)
    has_many(:events_created, Event, foreign_key: :creator_id)
    many_to_many(:events_participating, Event, join_through: Participation)
    timestamps()
  end

  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:email, :name, :image])
    |> validate_required(:email, message: "Email must be specified")
    |> validate_required(:name,
      message: "Display name must be specified"
    )
    |> validate_length(:name, min: 3)
    |> unique_constraint(:email, message: "Email already taken")
  end
end
