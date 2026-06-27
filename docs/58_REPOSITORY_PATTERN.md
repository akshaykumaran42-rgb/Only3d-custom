# REPOSITORY PATTERN

The Repository Pattern acts as an in-memory collection of Domain Entities.

## Rules

1.  **Interface First**: Every Aggregate Root (e.g., `Quote`, `Order`, `User`) must have an interface defined in its `domain/` layer (e.g., `IQuoteRepository`).
2.  **Implementation Hiding**: The concrete implementation (`PrismaQuoteRepository`) lives in the `persistence/` layer. It is injected into the Application Services via NestJS Dependency Injection.
3.  **No Leaky Abstractions**: The `IQuoteRepository` methods must return pure Domain Entities or generic DTOs, **NOT** Prisma-generated types.
4.  **No `include` in Services**: The Application Service cannot pass Prisma-specific syntax like `{ include: { items: true } }` into the repository. The repository methods must be explicitly named for the business intent, e.g., `findQuoteWithItems(id: string)`.

## Base Interface

All repositories should conceptually implement `IBaseRepository` located in `src/core/repositories/`, ensuring standard CRUD signatures exist across the platform.
