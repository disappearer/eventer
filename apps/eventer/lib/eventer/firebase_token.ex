defmodule Eventer.FirebaseToken do
  use Ecto.Schema
  import Ecto.Changeset

  alias Eventer.User

  schema "firebase_tokens" do
    field(:token, :string, primary_key: true)
    field(:os, :string, primary_key: true)
    field(:browser, :string, primary_key: true)
    belongs_to(:user, User, primary_key: true)
    timestamps()
  end

  def changeset(token, params \\ %{}) do
    token
    |> cast(params, [:token, :os, :browser, :user_id])
    |> validate_required(:token, message: "Token must be specified")
    |> validate_required(:os, message: "OS must be specified")
    |> validate_required(:browser, message: "Browser must be specified")
    |> unique_constraint(:os, name: :firebase_index)
  end
end
