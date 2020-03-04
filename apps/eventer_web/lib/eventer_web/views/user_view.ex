defmodule EventerWeb.UserView do
  use EventerWeb, :view

  def render("user.json", %{user: user}) do
    %{
      user: %{
        email: user.email,
        display_name: user.display_name
      }
    }
  end
end
