defmodule Persistence.EventsParticipantsTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Users}
  alias Eventer.{Repo, Participation}

  import Ecto.Query

  describe "Event participation" do
    setup do
      {:ok, user} =
        Users.insert_user(%{
          email: "test@example.com",
          name: "Test User"
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

    test "join", %{event: event, user: user} do
      {:ok, new_event} =
        Events.insert_event(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      {:ok, new_user} =
        Users.insert_user(%{
          email: "test1@example.com",
          name: "New User"
        })

      {:ok, _} = Events.join(event.id, new_user.id)
      {:ok, _} = Events.join(new_event.id, new_user.id)

      updated_event = Events.get_event(event.id)

      assert updated_event.participants === [user, new_user]
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

    test "leave", %{event: event, user: creator} do
      {:ok, user1} =
        Users.insert_user(%{
          email: "test1@example.com",
          name: "New User 1"
        })

      {:ok, user2} =
        Users.insert_user(%{
          email: "test2@example.com",
          name: "New User 2"
        })

      {:ok, _} = Events.join(event.id, user1.id)
      {:ok, _} = Events.join(event.id, user2.id)
      updated_event = Events.get_event(event.id)

      assert updated_event.participants === [creator, user1, user2]

      {1, nil} = Events.leave(event.id, user1.id)
      event_left = Events.get_event(event.id)

      assert event_left.participants === [creator, user2]
      assert event_left.ex_participants === [user1]
    end

    test "rejoining doesn't create a new participation record", %{event: event} do
      {:ok, user} =
        Users.insert_user(%{
          email: "test1@example.com",
          name: "New User 1"
        })

      Events.join(event.id, user.id)
      Events.leave(event.id, user.id)
      Events.join(event.id, user.id)

      user_id = user.id
      event_id = event.id

      [participation] =
        Repo.all(
          from(p in Participation,
            where: p.user_id == ^user_id and p.event_id == ^event_id
          )
        )

      assert participation.has_left == false
    end
  end
end
