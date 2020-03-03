defmodule Eventer.DataCase do
  use ExUnit.CaseTemplate

  alias Eventer.Repo

  using do
    quote do
      import Eventer.DataCase
    end
  end

  setup do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
  end

  def tomorrow() do
    days_in_future(1)
  end

  def days_in_future(days) do
    Timex.now() |> Timex.add(Timex.Duration.from_days(days))
  end

  def days_in_past(days) do
    Timex.now() |> Timex.subtract(Timex.Duration.from_days(days))
  end

  def diff(struct1, struct2) do
    map1 = KitchenSink.Struct.to_map(struct1)
    map2 = KitchenSink.Struct.to_map(struct2)

    delta =
      KitchenSink.Map.diff(map1, map2)
      |> Enum.sort()

    {delta, map1, map2}
  end
end
