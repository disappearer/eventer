defmodule EventTest do
  use ExUnit.Case

  # doctest Eventer

  alias Eventer.Event

  #// TODO: remove these tests in favor of those that test just the interface
  describe "Event changeset" do
    test "valid if valid (with time)" do
      e =
        Event.changeset(%Event{}, %{
          title: "Test",
          description: "test",
          time: tomorrow()
        })

      assert e.valid? === true
    end

    @tag :wip
    test "valid if valid (with new time decision)" do
      e =
        Event.changeset(%Event{}, %{
          title: "Test",
          description: "test",
          decisions: [%{title: "test", description: "test", objective: "time"}]
        })

      assert e.valid? === true
    end

    test "valid if valid (with existing time decision)" do
      e =
        Event.changeset(%Event{decisions: [%{objective: "time"}]}, %{
          title: "Test",
          description: "test"
        })

      assert e.valid? === true
    end

    test "invalid if no time  or time decision specified" do
      e = Event.changeset(%Event{}, %{title: "Test", description: "test"})
      assert e.valid? === false
    end

    @tag :skip #// TODO:  handle when updating
    test "invalid if no time and time decision will be overwritten" do
      e = Event.changeset(%Event{decisions: [%{objective: "time"}]}, %{title: "asdf", decisions: [%{objective: "general"}]})
      IO.inspect e, label: "e"
      assert e.valid? === false
    end
  end

  defp tomorrow() do
    Timex.now() |> Timex.add(Timex.Duration.from_days(1))
  end
end
