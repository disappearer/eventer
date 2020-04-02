defmodule EventerWeb.EventChannelConnectTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, UserSocket, EventChannel}
  alias Eventer.Persistence.Events

  describe "Event channel connect" do
    test "returns event data" do
      user = insert(:user)

      event = insert(:event, %{creator: user})

      options = build_list(3, :option)
      [option1 | [option2 | _]] = options

      poll =
        build(:poll, %{
          options: options,
          votes: %{3 => [option1.id, option2.id], 4 => [option2.id]}
        })

      insert(:decision, %{event: event, creator: user, poll: poll})

      event = Events.get_event(event.id) |> Events.to_map()
      event_id_hash = IdHasher.encode(event.id)

      {:ok, reply, _} =
        socket(UserSocket, "user:#{user.id}", %{})
        |> subscribe_and_join(EventChannel, "event:#{event_id_hash}")

      assert reply === %{event: event}

      %{event: %{decisions: [%{poll: poll}]}} = reply
      assert poll.voted_by === [4, 3]
      [option1 | [option2 | _]] = poll.options
      assert option1.votes === [3]
      assert option2.votes === [3, 4]

      Jason.encode!(event)
    end

    test "Jason doesn't crash when no votes" do
      user = insert(:user)

      event = insert(:event, %{creator: user})

      insert(:decision, %{event: event, creator: user})

      event = Events.get_event(event.id) |> Events.to_map()
      event_id_hash = IdHasher.encode(event.id)

      {:ok, reply, _} =
        socket(UserSocket, "user:#{user.id}", %{})
        |> subscribe_and_join(EventChannel, "event:#{event_id_hash}")

      assert reply === %{event: event}

      Jason.encode!(event)
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

    test "assigns event id to socket" do
      user = insert(:user)

      event = insert(:event, %{creator: user})
      insert(:decision, %{event: event, creator: user})

      event = Events.get_event(event.id) |> Events.to_map()
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        socket(UserSocket, "user:#{user.id}", %{})
        |> subscribe_and_join(EventChannel, "event:#{event_id_hash}")

      assert socket.assigns.event_id === event.id
    end
  end
end
