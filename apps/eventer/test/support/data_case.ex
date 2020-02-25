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
    Timex.now() |> Timex.add(Timex.Duration.from_days(1))
  end
end
