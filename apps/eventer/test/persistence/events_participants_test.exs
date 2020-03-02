defmodule Persistence.EventsParticipantsTest do
  use Eventer.DataCase

  alias Eventer.Persistence.Events
  alias Eventer.Repo

  describe "Event participation" do
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

      %{user: user, event: Repo.preload(event, :decisions)}
    end

    test "join", %{event: event} do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test1@example.com",
          display_name: "New User"
        })

      {:ok, _} = Events.join(event.id, user.id)
      updated_event = Events.get_event(event.id)

      assert updated_event.participants === [user]
    end

    test "join fails for non-existent user", %{event: event} do
      {:error, changeset} = Events.join(event.id, 420)
      {message, _} = Keyword.get(changeset.errors, :user)

      assert message === "User does not exist"
    end

    test "join fails for non-existent event", %{user: user} do
      {:error, changeset} = Events.join(420, user.id)
      {message, _} = Keyword.get(changeset.errors, :event)

      assert message === "Event does not exist"
    end

    test "leave", %{event: event} do
      {:ok, user1} =
        Eventer.insert_user(%{
          email: "test1@example.com",
          display_name: "New User 1"
        })

      {:ok, user2} =
        Eventer.insert_user(%{
          email: "test2@example.com",
          display_name: "New User 2"
        })

      {:ok, _} = Events.join(event.id, user1.id)
      {:ok, _} = Events.join(event.id, user2.id)
      updated_event = Events.get_event(event.id)

      assert updated_event.participants === [user1, user2]

      {1, nil} = Events.leave(event.id, user1.id)
      event_left = Events.get_event(event.id)

      assert event_left.participants === [user2]
    end
  end
end
