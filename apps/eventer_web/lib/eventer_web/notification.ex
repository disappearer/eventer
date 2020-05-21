defmodule EventerWeb.Notification do
  def send_message() do
    bla = Goth.Token.for_scope("https://www.googleapis.com/auth/firebase.messaging")
    IO.inspect bla, label: "bla"
  end
end
