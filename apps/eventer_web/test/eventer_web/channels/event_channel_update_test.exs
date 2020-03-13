defmodule EventerWeb.EventChannelUpdateTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.Persistence.{Events}
  alias Eventer.{Event, Repo}

  describe "Event update" do
    @tag authorized: 1
    test "'update_event' updates the event in DB", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      ref =
        push(socket, "update_event", %{
          event: %{"title" => "New Title", "description" => "New Description"}
        })

      assert_reply(ref, :ok, %{})

      updated_event = Repo.get(Event, event.id) |> Repo.preload(:creator)

      {changes, _, _} = diff(event, updated_event)

      assert changes === [
               {[:description], event.description, "New Description"},
               {[:title], event.title, "New Title"}
             ]
    end
  end

  @tag authorized: 1
  test "'event_updated' is broadcasted", %{
    connections: [%{user: user, socket: socket}]
  } do
    event = insert(:event, %{creator: user})
    event_id_hash = IdHasher.encode(event.id)

    {:ok, _, socket} =
      subscribe_and_join(
        socket,
        EventChannel,
        "event:#{event_id_hash}"
      )

    event_data = %{"title" => "New Title", "description" => "New Description"}

    push(socket, "update_event", %{
      event: event_data
    })

    assert_broadcast("event_updated", payload)
    assert payload === %{event: event_data}
  end
end
