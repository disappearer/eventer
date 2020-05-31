defmodule EventerWeb.ChannelWatcher do
  use GenServer

  ## Client API

  def monitor(pid, mfa) do
    GenServer.call(__MODULE__, {:monitor, pid, mfa})
  end

  def demonitor(pid) do
    GenServer.call(__MODULE__, {:demonitor, pid})
  end

  ## Server API

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    Process.flag(:trap_exit, true)
    {:ok, %{channels: Map.new()}}
  end

  def handle_call({:monitor, pid, mfa}, _from, state) do
    Process.link(pid)
    {:reply, :ok, put_channel(state, pid, mfa)}
  end

  def handle_call({:demonitor, pid}, _from, state) do
    case Map.get(state.channels, pid) do
      nil ->
        {:reply, :ok, state}

      {:ok, _mfa} ->
        Process.unlink(pid)
        {:reply, :ok, drop_channel(state, pid)}
    end
  end

  def handle_info({:EXIT, pid, _reason}, state) do
    case Map.get(state.channels, pid) do
      nil ->
        {:noreply, state}

      {mod, func, args} ->
        if Application.get_env(:eventer_web, :should_handle_leave) do
          Task.start_link(fn -> apply(mod, func, args) end)
        end

        {:noreply, drop_channel(state, pid)}
    end
  end

  defp drop_channel(state, pid) do
    %{state | channels: Map.delete(state.channels, pid)}
  end

  defp put_channel(state, pid, mfa) do
    %{state | channels: Map.put_new(state.channels, pid, mfa)}
  end
end
