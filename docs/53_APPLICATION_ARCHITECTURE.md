# APPLICATION ARCHITECTURE

The backend for the Only3D Platform is built using a strict **Feature-Sliced Clean Architecture** within NestJS.

## Core Philosophy

1.  **Business Logic First**: The application is built around the domains defined in Phase 3. The HTTP framework (NestJS) and the database ORM (Prisma) are treated as implementation details and are pushed to the outermost layers.
2.  **Decoupled Modules**: Each business feature (Identity, Quotes, Manufacturing) is isolated into its own module. Modules do not share database access.
3.  **Dependency Inversion**: High-level policies (business rules) never depend on low-level details (database, S3, Redis). Low-level details implement interfaces defined by high-level policies.

## The Global Layout

```text
apps/api/src/
├── core/                  # Shared domain building blocks & interfaces
├── infrastructure/        # Implementations of core interfaces (Prisma, S3, Redis)
└── modules/               # Feature-sliced business domains
    ├── identity/
    ├── quotes/
    ├── orders/
    └── [etc...]
```

## The Core Layer (`src/core`)

Contains elements that are purely domain-agnostic and ubiquitous across the platform:

- `errors/`: Unified Exception hierarchy (e.g., `DomainError`, `ApplicationError`).
- `events/`: Base classes for the Domain Event pattern (`DomainEvent`, `IEventBus`).
- `interfaces/`: Dependency Inversion ports (`IStorageService`, `ICacheService`).
- `repositories/`: Generic base interfaces (`IBaseRepository`).

## The Infrastructure Layer (`src/infrastructure`)

Contains concrete technical implementations. This layer is the _only_ place where third-party SDKs (AWS, Redis, BullMQ) and Prisma are instantiated.

- `PrismaModule` provides database access strictly to the `persistence` layers of the feature modules.
- The application layer _cannot_ import from `infrastructure/`. It must inject via `core/interfaces/`.
