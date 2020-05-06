defmodule EventerWeb.Presence do
  use Phoenix.Presence,
    otp_app: :eventer_web,
    pubsub_server: EventerWeb.PubSub
end
