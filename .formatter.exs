# Used by "mix format"
[
  inputs: ["mix.exs", "config/*.exs"],
  # subdirectories: ["apps/*"],
  line_length: 80,
  locals_without_parens: [
    get: :*,
    plug: :*,
    pipe_through: :*,
    resources: :*,
    post: :*
  ]
]
