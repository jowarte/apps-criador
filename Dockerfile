FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências nativas para Alpine (OpenSSL para o Prisma e compatibilidade libc)
RUN apk add --no-cache openssl libc6-compat

# Instala dependências dentro da pasta web
COPY web/package*.json ./
COPY web/prisma ./prisma/
RUN npm install

# Copia o código fonte e gera o build de produção
COPY web/ ./
RUN npx prisma generate
RUN npm run build

# Imagem final de execução
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Instala openssl na imagem final para o Prisma Client
RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --skip-generate || true; npm start"]
