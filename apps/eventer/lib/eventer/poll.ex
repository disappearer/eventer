defmodule Eventer.Poll do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field(:question, :string)
    field(:custom_answer_enabled, :boolean, default: true)
    field(:multiple_answers_enabled, :boolean, default: false)
    field(:votes, :map, default: %{})

    embeds_many :options, Option, on_replace: :delete do
      field(:text, :string)
    end
  end

  def changeset(poll, params \\ %{}) do
    options = params["options"] || Map.get(params, :options, nil)

    poll
    |> cast(params, [
      :question,
      :custom_answer_enabled,
      :multiple_answers_enabled,
      :votes
    ])
    |> cast_embed(:options, with: {__MODULE__, :option_changeset, [options]})
    |> validate_required(:custom_answer_enabled,
      message: "Question type (fixed) must be provided"
    )
    |> validate_options()
  end

  def option_changeset(option, params, options) do
    option
    |> cast(params, [:text])
    |> validate_required(:text, message: "Option text must be provided")
    |> validate_change(:text, fn :text, text ->
      if has_duplicate(options, text) do
        [text: "Has a duplicate"]
      else
        []
      end
    end)
  end

  defp validate_options(changeset) do
    options = get_field(changeset, :options)

    cond do
      less_than_two(options) ->
        validate_required(changeset, :question,
          message: "Question must be provided if there are less than 2 options"
        )

      true ->
        changeset
    end
  end

  defp has_duplicate(options, text) do
    options
    |> Enum.frequencies_by(&(Map.get(&1, :text) || Map.get(&1, "text")))
    |> (fn frequencies ->
          Map.get(frequencies, text, 0) >= 2
        end).()
  end

  defp less_than_two(options), do: length(options) < 2
end
