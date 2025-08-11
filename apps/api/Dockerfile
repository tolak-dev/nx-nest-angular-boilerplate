# Stage 1 – Build NestJS and generate Prisma client
FROM node:20 AS builder
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate --config=libs/shared/auth/infrastructure/prisma.config.ts

# Build NestJS app (Nx target: api)
RUN npx nx build api --configuration=production

# Stage 2 – Run production server
FROM node:20-alpine
WORKDIR /app

# Copy built app, node_modules, prisma, and generated client
COPY --from=builder /app/dist/apps/api ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/database/prisma ./database/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Run Prisma migration + start app
CMD ["node", "dist/main.js"]
