FROM node:20-alpine AS builder

WORKDIR /app

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

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --skip-generate || true; npm start"]
