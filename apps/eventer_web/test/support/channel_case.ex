defmodule EventerWeb.ChannelCase do
  @moduledoc """
  This module defines the test case to be used by
  channel tests.

  Such tests rely on `Phoenix.ChannelTest` and also
  import other functionality to make it easier
  to build common data structures and query the data layer.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use EventerWeb.ChannelCase, async: true`, although
  this option is not recommended for other databases.
  """

  use ExUnit.CaseTemplate

  alias EventerWeb.{Guardian, UserSocket}

  using do
    quote do
      # Import conveniences for testing with channels
      use Phoenix.ChannelTest

      import EventerWeb.Factory
      import EventerWeb.ChannelCase

      # The default endpoint for testing
      @endpoint EventerWeb.Endpoint

      setup tags do
        if tags[:notifications_enabled] do
          Application.put_env(:eventer_web, :notifications_enabled, true)

          on_exit(fn ->
            Application.put_env(:eventer_web, :notifications_enabled, false)
          end)
        end

        case tags[:authorized] do
          nil ->
            :ok

          number_of_users ->
            connections =
              for n <- 1..number_of_users do
                user = insert(:user)

                {:ok, token, _} =
                  Guardian.encode_and_sign(user, %{}, token_type: :access)

                {:ok, socket} = connect(UserSocket, %{token: token}, %{})
                %{socket: socket, user: user}
              end

            {:ok, %{connections: connections}}
        end
      end
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Eventer.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Eventer.Repo, {:shared, self()})
    end

    :ok
  end

  def diff(struct1, struct2, ignored_keys \\ []) do
    map1 = struct1 |> KitchenSink.Struct.to_map() |> Map.drop(ignored_keys)
    map2 = struct2 |> KitchenSink.Struct.to_map() |> Map.drop(ignored_keys)

    delta =
      KitchenSink.Map.diff(map1, map2)
      |> Enum.sort()

    {delta, map1, map2}
  end
end
