defmodule EventerWeb.Factory do
  use ExMachina.Ecto, repo: Eventer.Repo

  alias Eventer.{User, Event, Decision}

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
      display_name: sequence("Name"),
      email: sequence(:email, &"me#{&1}@example.com"),
    }
  end

  def decision_factory do
    %Decision{
      title: sequence("Decision Title"),
      description: sequence("Decision description"),
      event: build(:event),
      creator: build(:user)
    }
  end

  defp days_in_future(days) do
    Timex.now() |> Timex.add(Timex.Duration.from_days(days))
  end
end
