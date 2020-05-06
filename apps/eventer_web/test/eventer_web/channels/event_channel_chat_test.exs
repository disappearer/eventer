defmodule EventerWeb.EventChannelChatTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.Persistence.Messages
  alias Eventer.Message

  describe "Event chat" do
    @tag authorized: 2
    test "'chat_shout' inserts message into DB", %{
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

      message = "Hell World!"
      ref = push(joiner_socket, "chat_shout", %{text: message})
      assert_reply(ref, :ok, %{message: reply_message})

      %{id: id, text: text, event_id: event_id, user_id: user_id} =
        reply_message

      assert id !== nil
      assert text === message
      assert event_id === event.id
      assert user_id === joiner.user.id

      [%Message{text: text, event_id: event_id, user_id: user_id}] =
        Messages.get_messages(event.id)

      assert text === message
      assert event_id === event.id
      assert user_id === joiner.user.id
    end

    @tag authorized: 2
    test "'chat_shout' is broadcasted", %{
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

      message = "Hell World!"
      ref = push(joiner_socket, "chat_shout", %{text: message})
      assert_reply(ref, :ok, %{})

      [
        %Message{
          id: id,
          inserted_at: inserted_at
        }
      ] = Messages.get_messages(event.id)

      assert_broadcast("chat_shout", payload)

      assert payload === %{
               id: id,
               user_id: joiner.user.id,
               text: message,
               inserted_at: inserted_at
             }
    end

    @tag authorized: 2
    test "'get_chat_messages' gets event chat messages", %{
      connections: connections
    } do
      [creator, joiner] = connections
      event = insert(:event, %{creator: creator.user})

      messages =
        insert_list(13, :message, %{
          event: event,
          user: creator.user
        })

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, joiner_socket} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(joiner_socket, "join_event", %{})
      assert_reply(ref, :ok, %{})

      ref = push(joiner_socket, "get_chat_messages", %{})
      assert_reply(ref, :ok, %{messages: reply_messages})

      message_maps = Enum.map(messages, &Messages.to_map/1)
      assert reply_messages === message_maps
    end

    @tag authorized: 2
    test "'get_chat_messages' gets event chat messages for non-participants", %{
      connections: connections
    } do
      [creator, joiner] = connections
      event = insert(:event, %{creator: creator.user})

      messages =
        insert_list(13, :message, %{
          event: event,
          user: creator.user
        })

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, joiner_socket} =
        subscribe_and_join(
          joiner.socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref = push(joiner_socket, "get_chat_messages", %{})
      assert_reply(ref, :ok, %{messages: reply_messages})

      message_maps = Enum.map(messages, &Messages.to_map/1)
      assert reply_messages === message_maps
    end
  end
end
