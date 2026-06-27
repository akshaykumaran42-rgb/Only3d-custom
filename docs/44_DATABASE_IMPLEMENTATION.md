# DATABASE IMPLEMENTATION

This document details the complete implementation of the Only3D Platform's permanent data model across 12 distinct business domains.

## Overview

The schema is designed as the core "Source of Truth" for the entire platform. The application logic (Next.js and NestJS) will act as a thin layer executing business rules defined by these relational constraints. The schema consists of highly normalized tables mapped via Prisma.

## Implementation Details

### 1. Identity

- `User`: Represents both customers and employees.
- `Role` and `Permission`: A scalable RBAC configuration allowing granular API/UI access.
- `Address`: Multi-address support linked per user for billing and shipping.
- `Session`: Explicit tracking for security and multi-device revocation.

### 2. Catalog

- `Category` (Hierarchical self-referencing), `Product`, `ProductVariant`, `ProductImage`.
- Standard e-commerce catalog structure to support pre-designed models vs custom uploads.

### 3. Materials & Inventory

- `Material` -> `MaterialColor`: Decoupled architecture allowing specific colors per material (e.g., PLA -> Galaxy Black).
- `FilamentSpool`: Physical tracking of inventory.
- `InventoryMovement`: Ledger-style double-entry for filament tracking down to the gram.
- `StockAlert`: Real-time material depletion warnings.

### 4. Manufacturing

- `Printer` -> `PrinterNozzle`.
- `ManufacturingJob`: Distinct from Orders. A single order can spawn multiple parallel or sequential manufacturing jobs.
- `MaterialProfile`: A specific combination of a `Printer` and a `Material` to define precise hardware constraints (e.g., hotend temp).

### 5. Upload System

- `UploadedFile`: Maps to AWS S3/Cloud Storage.
- `FileAnalysis`: Extracted geometric data (volume, manifold status).
- `FileVersion`: Non-destructive iteration history.

### 6. Quotes & Orders

- **Quote**: Represents an estimated price proposal based on geometry and selected material. Quotes are immutable once created.
- **Order**: Created strictly upon a Quote converting to a paid entity.
- A Quote has many `QuoteItem`s, which become `OrderItem`s in an Order.

### 7. Payments & Shipping

- `PaymentTransaction`: Supports partial captures, refunds, and multi-gateway architecture.
- `Shipment`: Tracks fulfillment distinct from the Order state.

### 8. Administration

- `Setting`: Global key-value config.
- `AuditLog`: Immutable history of mutations.
- `FeatureFlag`, `Page`, `Coupon`.

## Technical Constraints Applied

- **UUID Primary Keys**: Eliminates enumeration attacks and aids distributed scaling.
- **Audit Fields**: All operational tables include `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, and `updatedBy`.
- **PostgreSQL Enums**: Enforced strict state machines for `JobStatus`, `OrderStatus`, and `QuoteStatus`.
- **Cascading Rules**: Explicit `onDelete: Cascade` applied to weak entities (e.g., deleting a User deletes their Sessions).
