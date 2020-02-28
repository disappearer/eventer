defmodule Persistence.EventUpdateTest do
  use Eventer.DataCase

  alias Eventer.Persistence.EventPersistence
  alias Eventer.Repo

  describe "Event update" do
    setup do
      {:ok, user} =
        Eventer.insert_user(%{
          email: "test@example.com",
          display_name: "Test User"
        })

      {:ok, event} =
        EventPersistence.insert(%{
          creator_id: user.id,
          title: "test event",
          description: "test description",
          time: tomorrow(),
          place: "nowhere"
        })

      %{user: user, event: Repo.preload(event, :decisions)}
    end

    test "success", %{event: event} do
      attrs = %{
        title: "new title",
        description: "new description"
      }

      {:ok, _} = EventPersistence.update(event.id, attrs)
      updated_event = EventPersistence.get(event.id)
      assert updated_event === Map.merge(event, attrs)
    end

    test "only title and description get updated", %{event: event} do
      attrs = %{
        title: "new title",
        description: "new description",
        time: tomorrow(),
        place: "elsewhere",
        decisions: %{
          title: "asdf",
          description: "asdf",
          objective: "general"
        }
      }

      {:ok, _} = EventPersistence.update(event.id, attrs)
      updated_event = EventPersistence.get(event.id)
      assert updated_event.time === event.time
      assert updated_event.place === event.place
      assert updated_event.decisions === event.decisions
    end

    test "includes cancelling", %{event: event} do
      refute event.cancelled
      {:ok, _} = EventPersistence.cancel(event.id)
      cancelled_event = EventPersistence.get(event.id)
      assert cancelled_event.cancelled
    end
  end
end
