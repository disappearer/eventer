defmodule EventerWeb.Notifier do
  @callback notify_absent_participants([String.t()], number(), %{
              title: String.t(),
              body: String.t()
            }) :: {:ok, term} | {:error, String.t()}
end
