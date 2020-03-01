defmodule Persistence.EventsUpdateTest do
  use Eventer.DataCase

  alias Eventer.Persistence.Events
  alias Eventer.Repo

  describe "Event update" do
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

    test "success", %{event: event} do
      attrs = %{
        id: event.id,
        title: "new title",
        description: "new description"
      }

      {:ok, _} = Events.update_event(event, attrs)
      updated_event = Events.get_event(event.id)

      assert updated_event |> Map.drop([:updated_at]) ===
               Map.merge(event, attrs) |> Map.drop([:updated_at])
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

      {:ok, _} = Events.update_event(event, attrs)
      updated_event = Events.get_event(event.id)
      assert updated_event.time === event.time
      assert updated_event.place === event.place
      assert updated_event.decisions === event.decisions
    end

    test "includes cancelling", %{event: event} do
      refute event.cancelled
      {:ok, _} = Events.cancel_event(event)
      cancelled_event = Events.get_event(event.id)
      assert cancelled_event.cancelled
    end
  end
end
