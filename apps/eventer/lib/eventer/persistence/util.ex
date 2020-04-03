defmodule Eventer.Persistence.Util do
  def get_error_map(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(&elem(&1, 0))
    |> lists_of_strings_to_strings()
  end

  defp lists_of_strings_to_strings(errors) do
    Enum.reduce(errors, %{}, fn {key, value}, acc ->
      value =
        case value do
          [message | _] when is_binary(message) ->
            message

          [map | _] = list when is_map(map) ->
            Enum.map(list, &lists_of_strings_to_strings/1)

          %{} = map ->
            lists_of_strings_to_strings(map)
        end

      Map.put_new(acc, key, value)
    end)
  end
end
