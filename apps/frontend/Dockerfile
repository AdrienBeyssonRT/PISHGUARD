# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN cd apps/frontend && npm ci

# Copy source code
COPY apps/frontend ./apps/frontend

# Build Next.js
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY apps/frontend/package.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/next.config.js ./next.config.js
COPY --from=builder /app/apps/frontend/app ./app

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
