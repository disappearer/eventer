defmodule Eventer.Message do
  use Ecto.Schema
  import Ecto.Changeset

  alias Eventer.{User, Event}

  schema "messages" do
    field(:text, :string)
    belongs_to(:user, User)
    belongs_to(:event, Event)
    timestamps()
  end

  def changeset(event, params \\ %{}) do
    event
    |> cast(params, [:text, :user_id, :event_id])
    |> validate_required(:text, message: "Text can't be blank")
    |> validate_required(:user_id, message: "User has to be specified")
    |> assoc_constraint(:user, message: "User does not exist")
    |> assoc_constraint(:event, message: "Event does not exist")
  end
end
