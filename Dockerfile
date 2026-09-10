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

RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs \
    && mkdir -p .next \
    && chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
