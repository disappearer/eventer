defmodule EventerWeb.EventChannelTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, UserSocket, EventChannel}
  alias Eventer.Persistence.Events

  describe "Event channel JOIN" do
    test "returns event data" do
      user = insert(:user)

      event = insert(:event, %{creator: user})
      insert(:decision, %{event: event, creator: user})

      event = Events.get_event(event.id) |> Events.to_map()
      event_id_hash = IdHasher.encode(event.id)

      {:ok, reply, _} =
        socket(UserSocket, "user:#{user.id}", %{})
        |> subscribe_and_join(EventChannel, "event:#{event_id_hash}")

      assert reply === %{event: event}
    end

    test "socket authorization fails with wrong token" do
      :error = connect(UserSocket, %{token: "invalid-token"}, %{})
    end

    test "socket authorization fails when missing token" do
      :error = connect(UserSocket, %{}, %{})
    end

    test "socket authorization success" do
      user = insert(:user)
      {:ok, token, _} = EventerWeb.Guardian.encode_and_sign(user)

      {:ok, socket} = connect(UserSocket, %{token: token}, %{})
      resource = Guardian.Phoenix.Socket.current_resource(socket)

      assert resource === user
    end
  end
end
