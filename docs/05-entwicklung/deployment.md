# Deployment

## Übersicht

Die Faninitiative-Plattform besteht aus mehreren Komponenten, die separat deployed werden:

- **Frontend**: React-Anwendung (Vite)
- **Backend**: Next.js API (containerisiert) - Phase 3
- **Datenbank**: MySQL
- **File Storage**: Google Drive

## Frontend Deployment (Phase 1-2)

### Build-Prozess

```bash
# Dependencies installieren
pnpm install

# Production Build erstellen
pnpm build:frontend

# Build-Output prüfen
ls -la frontend/dist/
```

### Deployment-Optionen

#### Option 1: Vercel (Empfohlen)

```bash
# Vercel CLI installieren
pnpm add -g vercel

# Im frontend/ Ordner
cd frontend
vercel

# Folge den Anweisungen:
# - Projekt verknüpfen
# - Production Deployment
```

**vercel.json**:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

#### Option 2: Netlify

```toml
# netlify.toml
[build]
  base = "frontend"
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

#### Option 3: GitHub Pages

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 9.15.1

      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm build:frontend

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

### Umgebungsvariablen

```bash
# .env.production
VITE_API_URL=https://api.faninitiative-spandau.de
VITE_EASYVEREIN_CLIENT_ID=your-client-id
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Backend Deployment (Phase 3)

### Docker Setup

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "start"]
```

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/faninitiative
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: faninitiative
      MYSQL_USER: user
      MYSQL_PASSWORD: pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db_data:
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: faninitiative-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: faninitiative-backend
  template:
    metadata:
      labels:
        app: faninitiative-backend
    spec:
      containers:
        - name: backend
          image: registry.gitlab.com/faninitiative/backend:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: faninitiative-secrets
                  key: database-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: faninitiative-backend
spec:
  selector:
    app: faninitiative-backend
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Datenbank

### MySQL Setup

#### Managed Service (Empfohlen)

- **AWS RDS**: MySQL 8.0
- **Google Cloud SQL**: MySQL 8.0
- **DigitalOcean Managed Database**: MySQL 8.0

#### Konfiguration

```sql
-- Initiale Datenbank
CREATE DATABASE IF NOT EXISTS faninitiative
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Backup User
CREATE USER 'backup'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, LOCK TABLES ON faninitiative.* TO 'backup'@'%';
```

### Migrations

```bash
# Migration ausführen
pnpm migrate:up

# Migration rückgängig
pnpm migrate:down

# Neuer Migration erstellen
pnpm migrate:create add_event_tags
```

### Backup-Strategie

```bash
# backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="faninitiative"

# Backup erstellen
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Komprimieren
gzip $BACKUP_DIR/backup_$DATE.sql

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload zu S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz \
  s3://faninitiative-backups/mysql/
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test
      - run: pnpm lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build:frontend
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: false # Aktivieren in Phase 3
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:latest
```

## Monitoring & Logging

### Application Performance Monitoring

```typescript
// sentry.config.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

### Logging

```typescript
// logger.config.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
```

### Health Checks

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  };

  res.status(200).json(health);
}
```

## SSL/TLS

### Let's Encrypt mit Certbot

```bash
# Installation
sudo apt-get update
sudo apt-get install certbot

# Zertifikat erstellen
sudo certbot certonly --standalone \
  -d faninitiative-spandau.de \
  -d www.faninitiative-spandau.de \
  -d api.faninitiative-spandau.de

# Auto-Renewal
sudo crontab -e
# Hinzufügen:
0 0 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name faninitiative-spandau.de;

    ssl_certificate /etc/letsencrypt/live/faninitiative-spandau.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/faninitiative-spandau.de/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Rollback-Strategie

### Frontend

```bash
# Vercel Rollback
vercel rollback

# Oder über Dashboard
# https://vercel.com/[team]/[project]/deployments
```

### Backend

```bash
# Kubernetes Rollback
kubectl rollout undo deployment/faninitiative-backend

# Docker Rollback
docker-compose down
docker-compose up -d --build
```

### Datenbank

```bash
# Restore from Backup
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < backup.sql
```

## Checkliste für Production

### Pre-Deployment

- [ ] Alle Tests grün
- [ ] Security Audit durchgeführt
- [ ] Performance Tests bestanden
- [ ] Dokumentation aktuell
- [ ] Umgebungsvariablen gesetzt
- [ ] SSL-Zertifikate installiert

### Post-Deployment

- [ ] Health Checks erfolgreich
- [ ] Monitoring aktiv
- [ ] Backup-Jobs laufen
- [ ] Error Tracking funktioniert
- [ ] Performance Metriken im Rahmen
- [ ] Rollback-Plan getestet
