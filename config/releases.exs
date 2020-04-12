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

config :eventer_web, :hashid_salt, System.fetch_env!("HASH_ID_SALT")

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: System.fetch_env!("GOOGLE_CLIENT_ID"),
  client_secret: System.fetch_env!("GOOGLE_CLIENT_SECRET")

config :eventer_web, EventerWeb.Guardian,
  issuer: "eventer_web",
  secret_key: System.fetch_env!("GUARDIAN_SECRET_KEY")

config :eventer_web, EventerWeb.Endpoint,
  check_origin: ["//lexlabs-eventer.herokuapp.com"]
