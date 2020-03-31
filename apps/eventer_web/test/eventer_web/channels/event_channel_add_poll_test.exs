defmodule EventerWeb.EventChannelAddPollTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Repo}

  describe "Add poll" do
    @tag authorized: 1
    test "'add_poll' success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "Should I?",
        fixed: true,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)

      assert db_poll.question === poll.question
      assert db_poll.fixed === poll.fixed

      [opt1, opt2] = poll.options
      [db_opt1, db_opt2] = db_poll.options
      assert db_opt1.text === opt1.text
      assert db_opt2.text === opt2.text
      assert db_opt1.id !== nil
      assert db_opt2.id !== nil
    end

    @tag authorized: 1
    test "'add_poll' with multi-vote success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "Should I?",
        fixed: true,
        multiple_votes: true,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)

      assert db_poll.question === poll.question
      assert db_poll.fixed === poll.fixed
      assert db_poll.multiple_votes === poll.multiple_votes

      [opt1, opt2] = poll.options
      [db_opt1, db_opt2] = db_poll.options
      assert db_opt1.text === opt1.text
      assert db_opt2.text === opt2.text
      assert db_opt1.id !== nil
      assert db_opt2.id !== nil
    end

    @tag authorized: 1
    test "'add_poll' with one option success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "Should I?",
        fixed: true,
        options: [%{text: "stay"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)

      assert db_poll.question === poll.question
      assert db_poll.fixed === poll.fixed

      [opt] = poll.options
      [db_opt] = db_poll.options
      assert db_opt.text === opt.text
      assert db_opt.id !== nil
    end

    @tag authorized: 1
    test "'add_poll' without question and with two (or more options) success",
         %{
           connections: [%{user: user, socket: socket}]
         } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "",
        fixed: true,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)
      assert db_poll.question === nil
      assert db_poll.fixed === poll.fixed

      [opt1, opt2] = poll.options
      [db_opt1, db_opt2] = db_poll.options
      assert db_opt1.text === opt1.text
      assert db_opt2.text === opt2.text
      assert db_opt1.id !== nil
      assert db_opt2.id !== nil
    end

    @tag authorized: 1
    test "'add_poll' fails with duplicate options", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "Should I?",
        fixed: true,
        options: [%{text: "stay"}, %{text: "stay"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :error, %{errors: errors})
      {message, _} = Keyword.get(errors, :options)
      assert message === "Cannot have duplicate options"
    end

    @tag authorized: 1
    test "'add_poll' fails if less than 2 options and no question", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "",
        fixed: true,
        options: [%{text: "option1"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :error, %{errors: errors})
      {message, _} = Keyword.get(errors, :question)

      assert message ===
               "Question must be provided if there are less than 2 options"
    end

    @tag authorized: 1
    test "'poll_added' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert(:event, %{creator: user})
      decision = insert(:decision, %{event: event, creator: user})

      decision = Repo.get(Decision, decision.id)

      event_id_hash = IdHasher.encode(event.id)

      {:ok, _, socket} =
        subscribe_and_join(
          socket,
          EventChannel,
          "event:#{event_id_hash}"
        )

      poll = %{
        question: "Should I?",
        fixed: true,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      push(socket, "add_poll", %{
        decision_id: decision.id,
        poll: poll
      })

      assert_broadcast("poll_added", %{decision_id: decision_id, poll: new_poll})

      assert decision_id === decision.id
      assert new_poll.question === poll.question
      assert new_poll.fixed === poll.fixed

      [opt1, opt2] = poll.options
      [new_opt1, new_opt2] = new_poll.options
      assert new_opt1.text === opt1.text
      assert new_opt2.text === opt2.text
      assert new_opt1.id !== nil
      assert new_opt2.id !== nil
    end
  end
end
