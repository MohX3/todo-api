FROM node:20-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:20-slim AS dependencies

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-slim AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
