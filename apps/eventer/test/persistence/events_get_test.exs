defmodule Persistence.EventGetTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Users}
  alias Eventer.Repo

  describe "Event get" do
    setup do
      {:ok, user} =
        Users.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: days_in_future(10),
          place: "nowhere"
        })

      %{user: user, event: event}
    end

    test "success", %{event: event} do
      assert Events.get_event(event.id) ===
               Repo.preload(event, [:creator, :decisions, :participants])
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

      assert Events.get_events_created_by_user(user) === [
               event1,
               event2,
               event3
             ]

      {:ok, new_user} =
        Users.insert_user(%{
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

      assert Events.get_events_created_by_user(new_user) === [
               new_user_event
             ]
    end

    test "get events user participates in sorted by time", %{
      user: user,
      event: event1
    } do
      # add different user
      {:ok, new_user} =
        Users.insert_user(%{
          email: "newtest@example.com",
          display_name: "New Test User"
        })

      {:ok, event2} =
        Events.insert_event(%{
          creator_id: new_user.id,
          title: "test event new 1",
          description: "test description",
          time: days_in_future(2),
          place: "nowhere"
        })

      {:ok, event3} =
        Events.insert_event(%{
          creator_id: new_user.id,
          title: "test event new 2",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      Events.join(event2.id, user.id)

      assert Events.get_events_participating(user) === [
               event1,
               event2
             ]

      Events.leave(event2.id, user.id)
      Events.join(event3.id, user.id)

      assert Events.get_events_participating(user) === [
               event1,
               event3
             ]

      assert Events.get_events_participating(new_user) === [
               event2,
               event3
             ]
    end
  end
end
