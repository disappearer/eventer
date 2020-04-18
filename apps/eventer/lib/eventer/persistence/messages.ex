defmodule Eventer.Persistence.Messages do
  import Ecto.Query

  alias Eventer.{Message, Repo}

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
