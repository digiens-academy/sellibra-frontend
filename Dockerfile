# Multi-stage build WITHOUT Nginx

# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Bağımlılıkları yükle
COPY package*.json ./
RUN npm ci

# 2) Kaynak kodu kopyala ve build al
COPY . .
RUN npm run build

# ---------- Stage 2: Runtime (Node ile statik servis) ----------
FROM node:18-alpine AS runner
WORKDIR /app

# İsteğe bağlı: düzgün sinyal yönetimi için dumb-init
RUN apk add --no-cache dumb-init

# SPA için en sağlıklı static server: 'serve'
RUN npm i -g serve@14

# Sadece build çıktısını kopyala
COPY --from=builder /app/dist ./dist

# Non-root kullanıcı
RUN addgroup -g 101 -S app && \
    adduser -S -D -H -u 101 -s /sbin/nologin -G app -g app app
USER app

# Uygulama portu
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Çalıştır (SPA rewrite için -s)
ENTRYPOINT ["dumb-init", "--"]
CMD ["serve", "-s", "dist", "-l", "3000"]
