defmodule EventerWeb.IdHasher do
  @coder Hashids.new(
           min_len: 20,
           salt: Application.compile_env(:eventer_web, :hashid_salt)
         )

  def encode(token_ids) do
    Hashids.encode(@coder, token_ids)
  end

  def decode(data) do
    {:ok, [id]} = Hashids.decode(@coder, data)
    id
  end
end
