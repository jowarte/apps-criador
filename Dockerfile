FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências dentro da pasta web
COPY web/package*.json ./
RUN npm install

# Copia o código fonte e gera o build de produção
COPY web/ ./
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

EXPOSE 3000

CMD ["npm", "start"]
