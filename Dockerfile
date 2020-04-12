################
# prepare base #
################

FROM elixir:1.10-alpine as base

RUN apk add --update bash

# prepare build dir
RUN mkdir /app
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# copy stuff
COPY config/ /app/config/
COPY mix.exs /app/
COPY mix.* /app/

COPY apps/eventer/mix.exs /app/apps/eventer/
COPY apps/eventer_web/mix.exs /app/apps/eventer_web/

COPY . /app/

################
# prepare test #
################

FROM base as test

# build deps
ENV MIX_ENV=test

RUN mix do deps.get --only $MIX_ENV

###################
# prepare release #
###################

FROM base as release

# install build dependencies
RUN apk add --update yarn

# build deps
ENV MIX_ENV=prod
RUN mix do deps.get --only $MIX_ENV, deps.compile

# build assets
WORKDIR /app/apps/eventer_web
RUN MIX_ENV=prod mix compile
RUN yarn --cwd ./assets
RUN yarn --cwd ./assets deploy
RUN mix phx.digest

WORKDIR /app
RUN MIX_ENV=prod mix release

#########################
# prepare release image #
#########################

FROM alpine:3.11 AS production
RUN apk add --update bash openssl

EXPOSE 4000
ENV PORT=4000 \
    MIX_ENV=prod \
    SHELL=/bin/bash

RUN mkdir /app
WORKDIR /app

COPY --from=release app/_build/prod/rel/eventer_umbrella .
COPY --from=release app/bin/ ./bin

RUN chown -R nobody: /app
USER nobody
ENV HOME=/app

CMD ["./bin/start"]
