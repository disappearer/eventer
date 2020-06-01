defmodule Eventer.Persistence.Users do
  alias Eventer.{User, Participation, Repo, FirebaseToken}

  import Ecto.Query

  def insert_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get(user_id) when is_binary(user_id) do
    user_id
    |> String.to_integer()
    |> get()
  end

  def get(user_id) do
    Repo.get(User, user_id)
  end

  def get_by_email(email) do
    Repo.get_by(User, %{email: email})
  end

  def insert_or_update(info) do
    case get_by_email(info.email) do
      nil -> %User{email: info.email}
      user -> user
    end
    |> User.changeset(info)
    |> Repo.insert_or_update()
  end

  def add_firebase_token(user, data) do
    %{"os" => os, "browser" => browser, "token" => token} = data
    user_id = user.id

    q =
      from(ft in FirebaseToken,
        where:
          ft.user_id == ^user_id and ft.os == ^os and
            ft.browser == ^browser
      )

    case Repo.one(q) do
      nil ->
        %FirebaseToken{}

      existing_record ->
        existing_record
    end
    |> FirebaseToken.changeset(%{
      user_id: user_id,
      os: os,
      browser: browser,
      token: token
    })
    |> Repo.insert_or_update()
  end

  def get_firebase_token(id),
    do: Repo.one(from(ft in FirebaseToken, where: ft.id == ^id))

  # not covered with tests
  def get_firebase_tokens(user_ids) do
    Repo.all(from(ft in FirebaseToken, where: ft.user_id in ^user_ids))
    |> Enum.map(&Map.get(&1, :token))
  end

  def get_last_event_visit(user_id, event_id) do
    participation =
      Repo.one(
        from(p in Participation,
          where: p.user_id == ^user_id and p.event_id == ^event_id
        )
      )

    participation.last_visited
  end

  def set_last_event_visit(user_id, event_id) do
    Repo.get_by(Participation, event_id: event_id, user_id: user_id)
    |> Participation.changeset(%{last_visited: Timex.now()})
    |> Repo.update()
  end

  def set_notification_pending(user_ids, event_id) do
    from(p in Participation,
      where: p.user_id in ^user_ids and p.event_id == ^event_id
    )
    |> Repo.update_all(set: [notification_pending: true])
  end

  def clear_notification_pending(user_id, event_id) do
    Repo.get_by(Participation, event_id: event_id, user_id: user_id)
    |> Participation.changeset(%{notification_pending: false})
    |> Repo.update()
  end

  def get_unnotified_users_ids(user_ids, event_id) do
    Repo.all(
      from(p in Participation,
        where:
          p.user_id in ^user_ids and p.event_id == ^event_id and
            p.notification_pending == false,
        select: p.user_id
      )
    )
  end

  def to_map(%User{} = user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    }
  end
end
