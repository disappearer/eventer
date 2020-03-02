defmodule Eventer.Poll do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field(:question, :string)
    field(:fixed, :boolean, default: false)
    field(:votes, :map, default: %{})

    embeds_many :options, Option, on_replace: :delete do
      field(:text, :string)
    end
  end

  def changeset(poll, params \\ %{}) do
    poll
    |> cast(params, [:question, :fixed, :votes])
    |> cast_embed(:options, with: &option_changeset/2)
    |> validate_required(:question, message: "Question must be provided")
    |> validate_required(:fixed,
      message: "Question type (fixed) must be provided"
    )
    |> validate_length(:question, min: 3, max: 100)
    |> validate_options()
  end

  defp option_changeset(option, params) do
    option
    |> cast(params, [:text])
    |> validate_required(:text, message: "Option text must be provided")
  end

  defp validate_options(changeset) do
    options = get_field(changeset, :options)

    if has_duplicates(options) do
      add_error(changeset, :options, "Cannot have duplicate options")
    else
      changeset
    end
  end

  defp has_duplicates(options) do
    options
    |> Enum.frequencies_by(&Map.get(&1, :text))
    |> Enum.any?(fn {_, frequency} -> frequency > 1 end)
  end
end
