defmodule EventerWeb.UserView do
  use EventerWeb, :view

  def render("user.json", %{user: user}) do
    %{
      user: %{
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  end

  def render("firebase_token.json", %{id: id}) do
    %{id: id}
  end

  def render("error.json", %{errors: errors}) do
    %{errors: errors}
  end
end
