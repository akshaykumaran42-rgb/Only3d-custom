# 15 Deployment Pipeline & Infrastructure

Only3D utilizes a decoupled, modern cloud-native deployment strategy.

## 1. Environments

- **Development:** Localhost. Uses `docker-compose` to spin up PostgreSQL and Redis.
- **Preview / Staging:** Ephemeral environments generated automatically on every Pull Request. Connected to a staging database.
- **Production:** The live application.

## 2. Frontend Infrastructure (Vercel)

The Next.js `apps/web` is deployed to Vercel.

- **Why Vercel?** Zero-config deployments for Next.js, Edge CDN for blazing fast loading of marketing pages, and automatic Preview deployments on GitHub PRs.
- **Environment Variables:** Sourced from Vercel's secure vault (e.g., `NEXT_PUBLIC_API_URL`).

## 3. Backend Infrastructure (Railway)

The NestJS `apps/api` and PostgreSQL database are hosted on Railway.

- **Why Railway?** Highly predictable pricing, persistent volumes for databases, and native Dockerfile support. Unlike serverless functions, NestJS runs as a persistent Node.js process, which is necessary for maintaining WebSocket connections to the Admin Dashboard.
- **Database:** A managed PostgreSQL instance provided by Railway with automated daily backups.

## 4. CI/CD Pipeline (GitHub Actions)

Every push to the `main` branch triggers the following workflow:

1.  **Lint & Format:** Runs `eslint` and `prettier` across the monorepo.
2.  **Type Check:** Runs `tsc --noEmit` to ensure strict TypeScript compliance.
3.  **Test:** Executes Jest unit tests (focusing on the Quote Engine).
4.  **Database Migration Check:** Runs `prisma generate` and checks for schema drift.
5.  **Build:** Turborepo builds both `web` and `api` simultaneously, leveraging build caching.
6.  **Deploy Backend:** If build passes, triggers a webhook to Railway to pull and deploy the NestJS API.
7.  **Deploy Frontend:** Vercel automatically deploys the Next.js app once the GitHub check passes.

## 5. Rollback Strategy

- **Frontend:** Vercel allows instant rollbacks to previous deployments with a single click.
- **Backend:** Railway supports reverting to previous image builds.
- **Database:** _Danger Zone._ Migrations (`prisma migrate deploy`) are forward-only. If a breaking schema change causes an outage, we must deploy a rapid hotfix (a new migration) rather than attempting to rollback the database state, which could result in data loss for new orders.
