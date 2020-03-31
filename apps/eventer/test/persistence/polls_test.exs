defmodule Persistence.PollsTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Decisions, Users}
  alias Eventer.Decision
  alias Eventer.Repo

  describe "Poll" do
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

      {:ok, decision} =
        Decisions.insert_decision(%{
          creator_id: user.id,
          event_id: event.id,
          title: "test decision 1",
          description: "test description",
          objective: "general"
        })

      %{decision: decision, user: user}
    end

    test "remove", %{decision: decision} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, decision_with_poll} = Decisions.update_poll(decision, poll)
      {:ok, _} = Decisions.remove_poll(decision_with_poll)
      %{poll: db_poll} = Repo.get(Decision, decision.id)
      assert db_poll === nil
    end

    test "remove option", %{decision: decision} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, decision_with_poll} = Decisions.update_poll(decision, poll)
      %{poll: %{options: [_, option2]}} = decision_with_poll

      {:ok, decision_without_new_option} =
        Decisions.remove_option(decision_with_poll, option2.id)

      {[change], d1, d2} = diff(decision_with_poll, decision_without_new_option)

      assert change ===
               {[:poll, :options], d1.poll.options, d2.poll.options}

      assert not Enum.any?(d2.poll.options, fn option ->
               option.text === option2.text
             end)
    end
  end
end
