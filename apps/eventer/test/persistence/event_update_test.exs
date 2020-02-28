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

    @tag :wip
    test "success", %{event: event} do
      attrs = %{
        title: "new title",
        description: "new description"
      }

      {:ok, _} = EventPersistence.update(event.id, attrs)
      updated_event = EventPersistence.get(event.id)
      assert updated_event === Map.merge(event, attrs)
    end

    @tag :wip
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
  end
end
