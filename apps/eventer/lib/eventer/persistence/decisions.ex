defmodule Eventer.Persistence.Decisions do
  alias Eventer.{Decision, Repo}

  def insert_decision(attrs) do
    %Decision{}
    |> Decision.standalone_changeset(attrs)
    |> Repo.insert()
  end

  def delete_decision(decision) do
    decision
    |> Decision.delete_changeset()
    |> Repo.delete()
  end

  def update_decision(decision, attrs) do
    decision
    |> Decision.update_changeset(attrs)
    |> Repo.update()
  end

  def resolve_decision(decision_id, resolution) do
    update_decision(decision_id, %{resolution: resolution, pending: false})
  end

  def discard_resolution(decision_id) do
    update_decision(decision_id, %{resolution: nil, pending: true})
  end
end
