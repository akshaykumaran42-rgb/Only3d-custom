# MODULE STRUCTURE

The Only3D API is divided into 14 distinct feature modules, mapping exactly to the business domains:

1.  `Identity` (Users, Roles, Sessions)
2.  `Customers` (CRM features, Addresses)
3.  `Catalog` (Products, Variants, Categories)
4.  `Materials` (Material types, Colors)
5.  `Uploads` (File handling, S3, Analysis)
6.  `Quotes` (Estimations, Drafts)
7.  `Orders` (Converted Quotes, Order Items)
8.  `Manufacturing` (Jobs, Printer Queues)
9.  `Inventory` (Filament Spools, Ledgers)
10. `Payments` (Transactions)
11. `Shipping` (Fulfillment, Tracking)
12. `Notifications` (Emails, Webhooks)
13. `CMS` (Static pages, Layouts)
14. `Administration` (Settings, Audit Logs)

## Internal Module Structure

Inside each module (e.g., `src/modules/quotes/`), the code is sliced into Clean Architecture layers:

```text
src/modules/quotes/
├── presentation/      # Controllers (HTTP logic)
├── application/       # Services & Use Cases (Coordination)
├── domain/            # Entities, Enums, Event definitions, Repo Interfaces
└── persistence/       # Prisma Repository implementations
```

This ensures that the "Quotes" domain does not become a tangled mess of HTTP routing mixed with database queries. Every module is a self-contained micro-application.
