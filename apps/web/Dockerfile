FROM node:20-alpine AS base
RUN npm install -g pnpm@10.12.4
WORKDIR /app

# Dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Development
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Production build
FROM base AS build
COPY . .
RUN pnpm build

# Production
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
