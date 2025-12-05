# Builder stage - compile TypeScript and build the application
FROM node:22-alpine AS builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY backend/ ./

# Build the application
RUN npm run build

# Production stage - minimal image with only runtime dependencies
FROM node:22-alpine

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/backend/dist ./dist

# Expose the application port
EXPOSE 8001

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main"]
