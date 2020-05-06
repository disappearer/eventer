defmodule EventerWeb.EventChannelPresenceTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}

  describe "Event presence" do
    @tag authorized: 2
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

      refute_broadcast("presence_diff", %{})

      ref = push(joiner_socket, "join_event", %{})
      assert_reply(ref, :ok, %{})

      key = "#{joiner.user.id}"

      assert_broadcast(
        "presence_diff",
        %{
          joins: %{^key => _},
          leaves: %{}
        }
      )

      Process.unlink(joiner_socket.channel_pid)

      leave(joiner_socket)

      assert_broadcast(
        "presence_diff",
        %{
          joins: %{},
          leaves: %{^key => _}
        }
      )

      {:ok, _, _} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

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
