# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN cd apps/backend && npm ci

# Copy source code
COPY apps/backend ./apps/backend
COPY apps/backend/prisma ./apps/backend/prisma

# Generate Prisma Client and build
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY apps/backend/package.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/backend/prisma ./prisma

EXPOSE 3001

# Start application (migrations handled by Ansible)
CMD ["node", "dist/main"]
