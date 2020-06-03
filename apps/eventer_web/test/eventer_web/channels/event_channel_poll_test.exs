defmodule EventerWeb.EventChannelPollTest do
  use EventerWeb.ChannelCase

  alias EventerWeb.{IdHasher, EventChannel}
  alias Eventer.{Decision, Repo}

  describe "Polls" do
    @tag authorized: 1
    test "'add_poll' success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
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
      assert db_poll.custom_answer_enabled === poll.custom_answer_enabled

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
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
        multiple_answers_enabled: true,
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
      assert db_poll.custom_answer_enabled === poll.custom_answer_enabled
      assert db_poll.multiple_answers_enabled === poll.multiple_answers_enabled

      [opt1, opt2] = poll.options
      [db_opt1, db_opt2] = db_poll.options
      assert db_opt1.text === opt1.text
      assert db_opt2.text === opt2.text
      assert db_opt1.id !== nil
      assert db_opt2.id !== nil
    end

    @tag authorized: 1
    test "'add_poll' with one option and custom answer enabled success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: true,
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
      assert db_poll.custom_answer_enabled === poll.custom_answer_enabled

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
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
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
      assert db_poll.custom_answer_enabled === poll.custom_answer_enabled

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
      event = insert_event(%{creator: user})
      decision = insert(:decision, %{event: event, creator: user, poll: nil})

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
        custom_answer_enabled: false,
        options: [%{text: "stay"}, %{text: "go"}, %{text: "stay"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :error, %{errors: errors})

      assert errors === %{
               options: [
                 %{text: "Has a duplicate"},
                 %{},
                 %{text: "Has a duplicate"}
               ]
             }
    end

    @tag authorized: 1
    test "'add_poll' fails if less than 2 options and no question", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: true,
        options: [%{text: "option1"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :error, %{errors: errors})

      assert errors === %{
               question:
                 "Question must be provided if there are less than 2 options"
             }
    end

    @tag authorized: 1
    test "'add_poll' fails if fixed and has less than 2 options", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        question: "What?",
        custom_answer_enabled: false,
        options: [%{text: "option1"}]
      }

      ref =
        push(socket, "add_poll", %{
          decision_id: decision.id,
          poll: poll
        })

      assert_reply(ref, :error, %{errors: errors})

      assert errors === %{
               custom_answer_enabled:
                 "Custom answers must be enabled if there are less than 2 options"
             }
    end

    @tag authorized: 1
    test "'poll_added' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      push(socket, "add_poll", %{
        decision_id: decision.id,
        poll: poll
      })

      assert_broadcast("poll_added", %{decision_id: decision_id, poll: new_poll})

      assert decision_id === decision.id
      assert new_poll.question === poll.question
      assert new_poll.custom_answer_enabled === poll.custom_answer_enabled

      [opt1, opt2] = poll.options
      [new_opt1, new_opt2] = new_poll.options
      assert new_opt1.text === opt1.text
      assert new_opt2.text === opt2.text
      assert new_opt1.id !== nil
      assert new_opt2.id !== nil

      assert_broadcast("chat_shout", payload)
      assert payload.is_bot === true

      assert payload.text ===
               "#{user.name} has added a poll for the \"#{decision.title}\" decision."
    end

    @tag authorized: 1
    test "'remove_poll' success", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
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
      assert db_poll.custom_answer_enabled === poll.custom_answer_enabled

      [opt1, opt2] = poll.options
      [db_opt1, db_opt2] = db_poll.options
      assert db_opt1.text === opt1.text
      assert db_opt2.text === opt2.text
      assert db_opt1.id !== nil
      assert db_opt2.id !== nil

      ref = push(socket, "remove_poll", %{decision_id: decision.id})
      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)
      assert db_poll === nil
    end

    @tag authorized: 1
    test "'poll_removed' is broadcasted", %{
      connections: [%{user: user, socket: socket}]
    } do
      event = insert_event(%{creator: user})
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
        custom_answer_enabled: false,
        options: [%{text: "stay"}, %{text: "go"}]
      }

      push(socket, "add_poll", %{
        decision_id: decision.id,
        poll: poll
      })

      assert_broadcast("poll_added", %{decision_id: decision_id, poll: new_poll})

      assert decision_id === decision.id
      assert new_poll.question === poll.question
      assert new_poll.custom_answer_enabled === poll.custom_answer_enabled

      [opt1, opt2] = poll.options
      [new_opt1, new_opt2] = new_poll.options
      assert new_opt1.text === opt1.text
      assert new_opt2.text === opt2.text
      assert new_opt1.id !== nil
      assert new_opt2.id !== nil

      assert_broadcast("chat_shout", payload)
      assert payload.is_bot === true

      assert payload.text ===
               "#{user.name} has added a poll for the \"#{decision.title}\" decision."

      ref = push(socket, "remove_poll", %{decision_id: decision.id})
      assert_reply(ref, :ok, %{})

      %{poll: db_poll} = Repo.get(Decision, decision.id)
      assert db_poll === nil

      assert_broadcast("poll_removed", %{decision_id: decision_id})
      assert decision_id === decision.id

      assert_broadcast("chat_shout", payload)
      assert payload.is_bot === true

      assert payload.text ===
               "#{user.name} has removed the poll from the \"#{decision.title}\" decision."
    end
  end
end
