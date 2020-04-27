defmodule EventerWeb.Factory do
  use ExMachina.Ecto, repo: Eventer.Repo
  import TestUtil

  alias Eventer.{User, Event, Decision, Poll, Message}

  def event_factory do
    %Event{
      title: sequence("Event Title"),
      description: sequence("Event description"),
      time: sequence(:time, &days_in_future/1),
      place: sequence("Place"),
      creator: build(:user)
    }
  end

  def user_factory do
    %User{
      name: sequence("Name"),
      email: sequence(:email, &"me#{&1}@example.com")
    }
  end

  def decision_factory do
    %Decision{
      title: sequence("Decision Title"),
      description: sequence("Decision description"),
      event: build(:event),
      creator: build(:user),
      poll: build(:poll)
    }
  end

  def poll_factory do
    %Poll{
      question: sequence("Question"),
      options: build_list(3, :option)
    }
  end

  def option_factory do
    %Poll.Option{id: sequence("id"), text: sequence("Option")}
  end

  def message_factory do
    %Message{
      text: sequence("Message"),
      user: build(:user),
      event: build(:event)
    }
  end
end
