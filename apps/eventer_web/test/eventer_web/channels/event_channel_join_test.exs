defmodule EventerWeb.EventChannelJoinTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.Persistence.Users
  alias Eventer.Repo

  describe "Event channel - join event" do
    @tag authorized: 2
    test "adds user to event participants", %{connections: connections} do
      [creator, joiner] = connections
      event = insert(:event, %{creator: creator.user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, joiner_socket} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(joiner_socket, "join_event", %{})
      assert_reply(ref, :ok, %{})

      participants =
        event |> Repo.preload(:participants) |> Map.get(:participants)

      assert participants === [joiner.user]
    end

    @tag authorized: 2
    test "broadcasts", %{connections: connections} do
      [creator, joiner] = connections
      event = insert(:event, %{creator: creator.user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, joiner_socket} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      push(joiner_socket, "join_event", %{})
      assert_broadcast("user_joined", payload)
      assert payload === %{user: Users.to_map(joiner.user)}
    end
  end
end
