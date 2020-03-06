defmodule EventerWeb.EventView do
  use EventerWeb, :view

  def render("event.json", %{event_id_hash: event_id_hash}) do
    %{event_id_hash: event_id_hash}
  end

  def render("error.json", %{errors: errors}) do
    %{errors: errors}
  end
end
