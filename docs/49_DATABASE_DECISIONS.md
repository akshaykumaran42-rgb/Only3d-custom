# DATABASE DECISIONS

This document logs the specific architectural and structural decisions made while drafting the Only3D platform database schema.

## 1. Int for Currency

**Decision**: Store all pricing variables (`basePrice`, `totalPrice`, `tax`, `amount`) as `Int`.
**Justification**: Floating point errors in JavaScript and PostgreSQL can lead to fractional cent mismatches. By storing cents natively as `Int`, arithmetic is perfectly safe. (e.g. ₹99.99 is stored as `9999`).

## 2. PostgreSQL Enums for State Machines

**Decision**: Used native Prisma `enum` for `OrderStatus`, `QuoteStatus`, `JobStatus`, etc.
**Justification**: Prevents magic string typos in the codebase. The database strictly rejects invalid states, adding a core layer of data integrity below the API layer.

## 3. Disconnected Quotes and Orders

**Decision**: Quotes and Orders are separate models. A Quote is effectively a Cart/Proposal.
**Justification**: The 3D printing flow requires iteration. A customer might upload a file, get a quote, modify the infill, and get a new quote. An `Order` is only a legal financial contract representing an agreed-upon quote. Merging them creates lifecycle hell.

## 4. Disconnected OrderItems and ManufacturingJobs

**Decision**: A single `OrderItem` can have one-to-many `ManufacturingJob`s.
**Justification**: A customer might order 10 quantities of the same model. The shop might fulfill this by queueing 2 jobs of 5 prints across 2 different printers. If the first job fails, a reprint job is created. The order item logic stays isolated from the physical hardware queue logic.

## 5. UUIDs Everywhere

**Decision**: `String @id @default(uuid())` is applied globally.
**Justification**: Auto-incrementing integers leak business intelligence (competitors can see you have "Order #400") and cause massive synchronization headaches in distributed environments. UUIDs are universally collision-resistant.

## 6. Cascade vs SetNull

**Decision**: Configured explicit `onDelete` actions.
**Justification**: If a `Material` is deleted, its `MaterialColor`s should be deleted (`Cascade`). If a `User` is deleted, their `Order`s should NOT be deleted; the user ID should simply nullify (`SetNull`) to preserve financial auditing laws.
