defmodule EventerWeb.Guardian do
  use Guardian, otp_app: :eventer_web

  alias Eventer.Persistence.Users
  alias Eventer.User

  def subject_for_token(%User{} = user, _claims) do
    {:ok, "User:#{user.id}"}
  end

  def subject_for_token(_, _) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(%{"sub" => "User:" <> user_id}) do
    {:ok, Users.get(user_id)}
  end

  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end
end
