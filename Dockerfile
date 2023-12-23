ARG NODE_VERSION=18-bullseye-slim
ARG PNPM_VERSION=^8.12.1

# 1st stage: Build Image
FROM node:latest AS build

WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && \
    npm install -g pnpm@$PNPM_VERSION && \
    pnpm install --prod


# 2nd stage: Production Image
FROM node:$NODE_VERSION

# set prod env for performance optimizations
ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

# non-root
USER node
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . ./

CMD ["dumb-init", "node", "src/server.js"]

# metadata
LABEL maintainer="Damien Shomrai <damien.shomrai@pm.me>"
LABEL name="waggler-prod"
LABEL version="latest"