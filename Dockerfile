# syntax=docker/dockerfile:1

# Dependencies are resolved from the committed bun.lock, so the image is
# reproducible. package-lock.json is stale and deliberately unused.
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Static generation queries PocketBase, so these are needed to build. They stay
# in this stage only — the runtime image below never sees them.
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_PB_URL
ARG NEXT_PUBLIC_UMAMI_SCRIPT
ARG NEXT_PUBLIC_UMAMI_ID
ARG PB_USERNAME
ARG PB_PASSWORD
ARG CLEAR_CACHE_KEY

ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
    NEXT_PUBLIC_PB_URL=$NEXT_PUBLIC_PB_URL \
    NEXT_PUBLIC_UMAMI_SCRIPT=$NEXT_PUBLIC_UMAMI_SCRIPT \
    NEXT_PUBLIC_UMAMI_ID=$NEXT_PUBLIC_UMAMI_ID \
    PB_USERNAME=$PB_USERNAME \
    PB_PASSWORD=$PB_PASSWORD \
    CLEAR_CACHE_KEY=$CLEAR_CACHE_KEY \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    BUILD_STANDALONE=1

RUN bun run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# curl is required by Coolify's healthcheck, which overrides any HEALTHCHECK
# declared here. It matters that it is curl and not busybox wget: the server
# binds IPv4 only, `localhost` resolves to ::1 first, and only curl retries the
# other address family.
RUN apk add --no-cache curl \
    && addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs \
    && mkdir -p .next \
    && chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
