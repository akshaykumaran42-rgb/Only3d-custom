# 11 Development Roadmap & Execution Strategy

This document outlines the sequential build order for the Only3D platform. Phases must be executed in order, as each builds upon the dependencies of the last.

## Phase 1: Documentation (Complete)

The permanent source of truth established (Documents 01-16).

## Phase 2: Monorepo & Database Setup

1.  Initialize Turborepo workspace.
2.  Setup `packages/database`.
3.  Write the Prisma schema (`04_DATABASE.md`).
4.  Execute `prisma migrate dev` to spin up local PostgreSQL.
5.  Seed the database with mock materials and a mock printer.

## Phase 3: Authentication Core

1.  Setup `apps/api` (NestJS).
2.  Implement JWT generation and validation (`13_SECURITY_MODEL.md`).
3.  Implement basic login/register routes.

## Phase 4: UI Foundation (Design System)

1.  Setup `packages/ui`.
2.  Configure Tailwind based on `09_DESIGN_SYSTEM.md`.
3.  Install and skin core shadcn/ui components (Buttons, Inputs, Tables).

## Phase 5: Quote Engine Backend

1.  Implement the complex math logic (`08_QUOTE_ENGINE.md`) in NestJS `QuoteService`.
2.  Write robust Unit Tests (`14_TESTING_STRATEGY.md`) to verify calculations against edge cases.
3.  Implement R2 pre-signed URL generation.

## Phase 6: Public Site & Quoting UI

1.  Setup `apps/web` (Next.js).
2.  Build the Marketing Homepage and Material Library (SSG).
3.  Build the Quote Configurator SPA.
4.  Connect frontend Quote Configurator to backend `QuoteService`.

## Phase 7: Checkout & Payments

1.  Integrate Razorpay SDK in Next.js.
2.  Implement Razorpay webhook listener in NestJS to transition `Quote` to `Order`.
3.  Implement Address validation logic.

## Phase 8: Admin OS (The Command Center)

1.  Build the protected `/admin` routes in Next.js.
2.  Implement the Global Command Palette (`CMD+K`).
3.  Build the Order Kanban/Grid.
4.  Build the Pricing Rules CRUD interface.
5.  Build the Fleet Management CRUD interface.

## Phase 9: Customer Portal

1.  Build the protected `/dashboard` routes in Next.js.
2.  Build the Order tracking timeline.
3.  Build the Saved Models asset library.

## Phase 10: E2E Testing & Hardening

1.  Write Playwright tests for the critical path: (Upload -> Quote -> Checkout -> Admin Approval).
2.  Perform security audits on R2 bucket permissions.

## Phase 11: Production Deployment

1.  Deploy Database to Railway Production.
2.  Deploy API to Railway Production.
3.  Deploy Next.js to Vercel.
4.  Configure custom domains and SSL.
