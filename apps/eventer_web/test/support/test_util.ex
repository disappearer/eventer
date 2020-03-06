defmodule TestUtil do
  def tomorrow() do
    days_in_future(1)
  end

  def days_in_future(days) do
    Timex.now()
    |> DateTime.truncate(:second)
    |> Timex.add(Timex.Duration.from_days(days))
  end

  def days_in_past(days) do
    Timex.now()
    |> DateTime.truncate(:second)
    |> Timex.subtract(Timex.Duration.from_days(days))
  end
end
