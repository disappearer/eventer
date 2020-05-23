ExUnit.start()
{:ok, _} = Application.ensure_all_started(:ex_machina)

Mox.defmock(EventerWeb.NotifierMock, for: EventerWeb.Notifier)
