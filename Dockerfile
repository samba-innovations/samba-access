# =============================================================================
# samba access — Dockerfile
# =============================================================================

# ── 1. Dependências ──────────────────────────────────────────────────────────
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── 2. Build ─────────────────────────────────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
ARG NEXT_PUBLIC_URL_ACCESS
ENV NEXT_PUBLIC_URL_ACCESS=${NEXT_PUBLIC_URL_ACCESS}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── 3. Runner ────────────────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3002
CMD ["node_modules/.bin/next", "start", "-p", "3002"]
