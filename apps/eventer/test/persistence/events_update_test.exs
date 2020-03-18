defmodule Persistence.EventsUpdateTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Users}
  alias Eventer.Repo

  describe "Event update" do
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
          time: tomorrow(),
          place: "nowhere"
        })

      event =
        event
        |> Repo.preload([:creator, :decisions])
        |> Events.preload_participation_assocs()

      %{user: user, event: event}
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
  end
end
