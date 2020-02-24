defmodule Eventer.Repo do
  use Ecto.Repo,
    otp_app: :eventer,
    adapter: Ecto.Adapters.Postgres
end
