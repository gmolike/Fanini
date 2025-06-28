# frontend/Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.15.1

WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json pnpm-lock.yaml* ./
COPY frontend/package.json ./frontend/

# Install dependencies in container (not from host)
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
WORKDIR /app/frontend

# Copy source code (node_modules are excluded via .dockerignore)
COPY frontend/ ./

EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Build stage
FROM base AS build
WORKDIR /app/frontend

# Copy source code
COPY frontend/ ./

RUN pnpm build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
