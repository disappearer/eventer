defmodule EventerWeb.FirebaseNotifier do
  alias Eventer.Persistence.Users

  @behaviour EventerWeb.Notifier

  @impl EventerWeb.Notifier
  def notify_absent_participants(participant_ids, event, notification) do
    firebase_tokens = Users.get_firebase_tokens(participant_ids)

    {:ok, %{token: firebase_admin_token}} =
      Goth.Token.for_scope("https://www.googleapis.com/auth/firebase.messaging")

    url = "https://fcm.googleapis.com/v1/projects/eventer-183814/messages:send"

    headers = [{"Authorization", "Bearer #{firebase_admin_token}"}]

    event_id_hash = EventerWeb.IdHasher.encode(event.id)

    firebase_tokens
    |> Enum.each(fn firebase_token ->
      body =
        Jason.encode!(%{
          message: %{
            notification: notification,
            webpush: %{
              headers: %{
                Urgency: "high"
              },
              data: %{
                id_hash: event_id_hash,
                event_title: event.title
              },
              notification: %{
                body: notification.body,
                requireInteraction: "true",
                badge: "/badge-icon.png"
              },
              fcm_options: %{
                link: "http://localhost:4000/events/#{event_id_hash}"
              }
            },
            token: firebase_token
          }
        })

      HTTPoison.post(url, body, headers)
    end)
  end
end
