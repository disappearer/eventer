import Config

secret_key_base = System.fetch_env!("SECRET_KEY_BASE")

config :eventer, Eventer.Repo, url: System.fetch_env!("DATABASE_URL")

config :eventer_web, EventerWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base: secret_key_base,
  server: true
