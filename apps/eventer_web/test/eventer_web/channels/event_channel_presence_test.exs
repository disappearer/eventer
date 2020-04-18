defmodule EventerWeb.EventChannelPresenceTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.Persistence.{Events, Users}
  alias Eventer.Repo

  describe "Event presence" do
    @tag authorized: 2
    @tag :skip
    test "'join_event' adds user to event participants", %{
      connections: connections
    } do
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

      refute_broadcast("presence_diff", %{})

      Process.unlink(joiner_socket.channel_pid)

      leave(joiner_socket)

      {:ok, _, joiner_socket} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      key = "user:#{joiner.user.id}"

      assert_broadcast(
        "presence_diff",
        %{
          joins: %{^key => _},
          leaves: %{}
        }
      )
    end
  end
end
