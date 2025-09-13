FROM jarredsumner/bun:latest AS base

WORKDIR /app

FROM base AS deps

COPY package.json bun.lock ./

RUN bun install

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 bunsh && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bunsh /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunsh /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "start"]
