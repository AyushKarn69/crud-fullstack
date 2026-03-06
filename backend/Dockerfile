# Multi-stage build for backend

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
