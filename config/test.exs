import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :eventer_web, EventerWeb.Endpoint,
  http: [port: 4002],
  server: false

config :eventer_web, :notifier, EventerWeb.NotifierMock
config :eventer_web, :should_handle_leave, false

config :eventer, Eventer.Repo,
  url:
    System.get_env("DATABASE_URL") ||
      "ecto://postgres:postgres@localhost/eventer_test",
  port: "5432",
  pool: Ecto.Adapters.SQL.Sandbox

config :logger, level: :warning

config :eventer_web, :hashid_salt, System.fetch_env!("HASH_ID_SALT")

# config :eventer_web, EventerWeb.Guardian,
#   issuer: "eventer_web",
#   secret_key: System.fetch_env!("GUARDIAN_SECRET_KEY")

# import_config "test.secret.exs"
