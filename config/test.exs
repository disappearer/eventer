import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :eventer_web, EventerWeb.Endpoint,
  http: [port: 4002],
  server: false

config :eventer, Eventer.Repo,
  url: "ecto://postgres:postgres@localhost/eventer_test",
  port: "5432",
  pool: Ecto.Adapters.SQL.Sandbox

config :logger, level: :warning

import_config "test.secret.exs"
