defmodule Eventer.Persistence.Messages do
  import Ecto.Query

  alias Eventer.{Message, Repo}
  alias Eventer.Persistence.Users

  def insert_message(attrs) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end

  def get_messages(event_id) do
    q =
      from(
        m in Message,
        where: m.event_id == ^event_id,
        select: m,
        order_by: m.inserted_at
      )

    Repo.all(q)
  end

  def get_messages(event_id, after_time) do
    q =
      from(
        m in Message,
        where: m.event_id == ^event_id and m.inserted_at > ^after_time,
        select: m,
        order_by: m.inserted_at
      )

    Repo.all(q)
  end

  def get_new_messages(event_id, user_id) do
    last_visited = Users.get_last_event_visit(user_id, event_id)

    q =
      from(
        m in Message,
        where: m.event_id == ^event_id and m.inserted_at >= ^last_visited,
        select: m,
        order_by: m.inserted_at
      )

    Repo.all(q)
  end

  def to_map(%Message{} = message) do
    %{
      id: message.id,
      text: message.text,
      user_id: message.user_id,
      event_id: message.event_id,
      inserted_at: message.inserted_at
    }
  end
end
