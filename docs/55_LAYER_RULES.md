# LAYER RULES

To preserve the architecture over the next decade, strict rules govern what code is permitted in each layer.

## 1. Presentation Layer (`presentation/`)

- **Responsibility**: Receive HTTP requests, parse DTOs, pass data to Application Services, and format HTTP responses.
- **Allowed**: NestJS `@Controller()`, `@Get()`, `@Post()`, `class-validator` DTOs.
- **Forbidden**: Business logic, Prisma queries, `throw new DomainError()`.

## 2. Application Layer (`application/`)

- **Responsibility**: Orchestrate the workflow. Fetch entities via repositories, enforce business rules, save entities, and publish events.
- **Allowed**: NestJS `@Injectable()`, `DomainEvent` publishing, `IEventBus`.
- **Forbidden**: `req`/`res` objects, HTTP Status Codes, Prisma Client (`this.prisma`).

## 3. Domain Layer (`domain/`)

- **Responsibility**: Define the "Heart of the Software". Contains Entities, Value Objects, and the pure business rules.
- **Allowed**: Pure TypeScript classes, Interfaces (`IQuoteRepository`), Enum definitions.
- **Forbidden**: NestJS decorators (except perhaps basic DI tokens), Prisma dependencies, HTTP logic.

## 4. Persistence Layer (`persistence/`)

- **Responsibility**: Implement the Domain Repository Interfaces using Prisma.
- **Allowed**: Prisma Client, Prisma transactions, mapping Prisma models to Domain Entities.
- **Forbidden**: Business rules, HTTP logic, Domain event publishing.
