# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
import Config

config :eventer_web,
  generators: [context_app: false]

# Configures the endpoint
config :eventer_web, EventerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base:
    "zagCOPIlR7o1aWkTY4X5pCbuHy+OyjaouX4zEmAuH5p8zqaEO+m7W1+bYapL/Oa9",
  render_errors: [view: EventerWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: EventerWeb.PubSub, adapter: Phoenix.PubSub.PG2],
  live_view: [signing_salt: "W7gV8T4z"]

config :eventer, Eventer.Repo,
  database: "eventer",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :eventer, ecto_repos: [Eventer.Repo]

config :phoenix, :json_library, Jason

# Configure Google OAuth
config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email profile"]}
  ]

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: System.get_env("GOOGLE_CLIENT_ID"),
  client_secret: System.get_env("GOOGLE_CLIENT_SECRET")

config :eventer_web, EventerWeb.Guardian,
  issuer: "eventer_web",
  secret_key: "Secret key. You can use `mix guardian.gen.secret` to get one"

# Sample configuration:
#
#     config :logger, :console,
#       level: :info,
#       format: "$date $time [$level] $metadata$message\n",
#       metadata: [:user_id]
#

import_config "#{Mix.env()}.exs"
