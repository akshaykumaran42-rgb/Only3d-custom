# MIGRATION PLAN

Prisma supports incremental, version-controlled schema migrations via `prisma migrate dev`.
To strictly adhere to the requirement of "never generate one massive migration", the execution of migrations against the production database will occur in the following phases:

## Phase 1: Identity & Authentication

1. We will push `User`, `Role`, `Permission`, and `Session`.
2. Generate migration: `prisma migrate dev --name init_identity`

## Phase 2: Core Catalog

1. We will push `Category`, `Product`, `ProductVariant`, and `ProductImage`.
2. Generate migration: `prisma migrate dev --name add_catalog`

## Phase 3: Hardware & Inventory

1. Push `Material`, `MaterialColor`, `FilamentSpool`, and `Printer`.
2. Generate migration: `prisma migrate dev --name add_manufacturing_inventory`

## Phase 4: Order Engine (The Core)

1. Push `Quote`, `QuoteItem`, `Order`, `OrderItem`, and `ManufacturingJob`.
2. Generate migration: `prisma migrate dev --name add_quote_order_engine`

## Phase 5: Finance & Logistics

1. Push `PaymentTransaction` and `Shipment`.
2. Generate migration: `prisma migrate dev --name add_payments_shipping`

## Execution Command

When initializing a fresh environment, run:

```bash
pnpm --filter @only3d/database exec prisma migrate deploy
```

This guarantees migrations are applied sequentially without diffing against a potentially corrupted shadow database.
