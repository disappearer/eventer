defmodule EventerWeb.Router do
  use EventerWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :guardian_auth do
    plug Guardian.Plug.Pipeline,
      module: EventerWeb.Guardian,
      error_handler: EventerWeb.AuthErrorHandler

    plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource, allow_blank: true
  end

  scope "/auth", EventerWeb do
    pipe_through :browser

    get "/logout", AuthController, :logout
    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  scope "/api", EventerWeb do
    pipe_through :api
    pipe_through :guardian_auth

    get "/me", UserController, :index
    post "/me/firebase_token", UserController, :add_firebase_token
    resources "/events", EventController, only: [:index, :create, :delete]
  end

  scope "/", EventerWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
