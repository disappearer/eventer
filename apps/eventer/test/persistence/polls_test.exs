defmodule Persistence.PollsTest do
  use Eventer.DataCase

  alias Eventer.Persistence.{Events, Decisions}
  alias Eventer.Decision
  alias Eventer.Repo

  describe "Poll" do
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

    test "add success", %{decision: decision} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, _} = Decisions.update_poll(decision, poll)
      %{poll: db_poll} = Repo.get(Decision, decision.id)
      assert db_poll.question === poll.question
      [option1, option2] = poll.options
      [db_option1, db_option2] = db_poll.options
      assert option1.text === db_option1.text
      assert option2.text === db_option2.text
      # assert poll.votes === %{}
    end

    test "can't add poll with duplicate options", %{decision: decision} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 1"}
        ]
      }

      {:error, changeset} = Decisions.update_poll(decision, poll)
      {message, _} = Keyword.get(changeset.changes.poll.errors, :options)
      assert message === "Cannot have duplicate options"
    end

    test "must have a question", %{decision: decision} do
      poll = %{}

      {:error, changeset} = Decisions.update_poll(decision, poll)
      {message, _} = Keyword.get(changeset.changes.poll.errors, :question)
      assert message === "Question must be provided"
    end

    test "vote", %{decision: decision, user: user} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, decision_with_poll} = Decisions.update_poll(decision, poll)
      %{poll: %{options: [_, option2]}} = decision_with_poll

      {:ok, _} = Decisions.vote(decision_with_poll, user.id, option2.id)
      decision_with_vote = Repo.get(Decision, decision.id)

      {[change | _], _, _} = diff(decision_with_poll, decision_with_vote)

      assert change ===
               {[:poll, :votes], %{},
                %{Integer.to_string(user.id) => option2.id}}
    end

    test "add option", %{decision: decision} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, decision_with_poll} = Decisions.update_poll(decision, poll)

      {:ok, decision_with_new_option} =
        Decisions.add_option(decision_with_poll, "Option 3")

      {[change], d1, d2} = diff(decision_with_poll, decision_with_new_option)

      assert change ===
               {[:poll, :options], d1.poll.options, d2.poll.options}

      assert Enum.any?(d2.poll.options, fn option ->
               option.text === "Option 3"
             end)
    end

    test "vote new option", %{decision: decision, user: user} do
      poll = %{
        question: "Question?",
        options: [
          %{text: "Option 1"},
          %{text: "Option 2"}
        ]
      }

      {:ok, decision_with_poll} = Decisions.update_poll(decision, poll)

      {:ok, _} = Decisions.vote_new(decision_with_poll, user.id, "Option 3")
      decision_with_vote = Repo.get(Decision, decision.id)
      %{poll: %{options: [_, _, option3]}} = decision_with_vote

      {[options_change, votes_change | _], d1, d2} =
        diff(decision_with_poll, decision_with_vote)

      assert options_change ===
               {[:poll, :options], d1.poll.options, d2.poll.options}

      assert votes_change ===
               {[:poll, :votes], %{},
                %{Integer.to_string(user.id) => option3.id}}
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
