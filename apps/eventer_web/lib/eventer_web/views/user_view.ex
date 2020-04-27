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

  def render("error.json", %{message: message}) do
    %{message: message}
  end
end
