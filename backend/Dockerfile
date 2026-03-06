# Multi-stage build for backend

FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL and build dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

# Install OpenSSL runtime for Prisma
RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
