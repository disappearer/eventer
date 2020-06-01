defmodule EventerWeb.EventChannelPresenceTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.Persistence.Users
  alias Eventer.{Participation, Repo}

  import Ecto.Query

  describe "Event presence" do
    @tag authorized: 2
    test "'join_event' adds user to event participants", %{
      connections: connections
    } do
      [creator, joiner] = connections
      event = insert_event(%{creator: creator.user})
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

    @tag :skip
    @tag authorized: 2
    test "'join_event' triggers channel leave monitoring", %{
      connections: connections
    } do
      [creator, joiner] = connections
      event = insert_event(%{creator: creator.user})
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

      Application.put_env(:eventer_web, :should_handle_leave, true)

      Process.unlink(joiner_socket.channel_pid)
      :ok = close(joiner_socket)

      Process.sleep(100)
      Application.put_env(:eventer_web, :should_handle_leave, false)

      after_leaving = Timex.now()

      joiner_id = joiner.user.id
      event_id = event.id

      participation =
        Repo.one(
          from(pt in Participation,
            where: pt.user_id == ^joiner_id and pt.event_id == ^event_id
          )
        )

      last_visited = Users.get_last_event_visit(joiner_id, event_id)

      assert last_visited !== nil
      assert last_visited === participation.last_visited
      assert Timex.diff(last_visited, after_leaving, :seconds) < 1
    end
  end
end
