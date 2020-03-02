defmodule Persistence.EventGetTest do
  use Eventer.DataCase

  alias Eventer.Persistence.Events
  alias Eventer.Repo

  describe "Event get" do
    setup do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      %{user: user, event: event}
    end

    test "success", %{event: event} do
      assert Events.get_event(event.id) ===
               Repo.preload(event, [:decisions, :participants])
    end

    test "returns nil if not found" do
      assert Events.get_event(420) === nil
    end

    test "get events created by user sorted by id", %{user: user, event: event1} do
      # add more events by user
      {:ok, event2} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      {:ok, event3} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      assert Events.get_events_created_by_user(user.id) === [
               event1,
               event2,
               event3
             ]

      {:ok, new_user} =
        Eventer.insert_user(%{
          email: "test1@example.com",
          display_name: "Test User 1"
        })

      {:ok, new_user_event} =
        Events.insert_event(%{
          creator_id: new_user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      assert Events.get_events_created_by_user(new_user.id) === [
               new_user_event
             ]
    end
  end
end
