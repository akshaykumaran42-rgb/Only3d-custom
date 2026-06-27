# 14 Testing Strategy & Quality Assurance

Manufacturing software cannot fail silently. A miscalculation in the Quote Engine could result in printing a part at a massive financial loss.

## 1. Unit Testing (Jest)

**Focus:** Pure business logic and mathematical algorithms.

- **Target:** `packages/utils` and NestJS `Services`.
- **The Quote Engine (`08_QUOTE_ENGINE.md`):** This is the most heavily tested module. We will write hundreds of assertions passing mock volumes, materials, and edge-case bounding boxes to ensure the calculated price is accurate down to the penny.
- _Rule:_ Any change to the pricing math requires a corresponding test case before a PR can be merged.

## 2. Integration Testing

**Focus:** Database transactions and API boundaries.

- **Target:** NestJS `Controllers` and Prisma queries.
- **Scenarios:**
  - Attempting to transition an Order state from `SHIPPED` back to `PENDING` (should fail).
  - Attempting to access another user's `File` entity (should return 403 Forbidden).
- _Implementation:_ Using Testcontainers or a dedicated local PostgreSQL database spun up via Docker during the CI pipeline.

## 3. End-to-End (E2E) Testing (Playwright)

**Focus:** The critical user journey across the network boundary.

- **Target:** The deployed Next.js application interacting with the NestJS backend.
- **The "Golden Path" Test:**
  1.  Playwright spins up an incognito browser.
  2.  Navigates to the Quote page.
  3.  Mocks an STL upload.
  4.  Selects "PETG" and "20% Infill".
  5.  Asserts the UI price updates correctly.
  6.  Completes checkout using a mock Razorpay card.
  7.  Logs in as Admin and asserts the order appears in the Kanban board.
- _Rule:_ If the Golden Path fails, the deployment is immediately halted.

## 4. Visual Regression Testing

- Given our strict adherence to `09_DESIGN_SYSTEM.md`, we will use Chromatic or a similar tool to detect unintentional CSS changes to our core shadcn/ui components (e.g., ensuring a Button doesn't accidentally lose its hover state).
