# 04 Database Schema Design (Prisma)

This document defines the exhaustive, highly normalized PostgreSQL schema required to power the Only3D platform without hardcoding business data.

## 1. Core Principles

- **Immutability of Historical Data:** When a Quote becomes an Order, the exact price, material cost, and physical parameters are snapshotted into the `Order` and `OrderItem` tables. If the Admin later changes the global `CostPerKg` of a material, historical orders must _not_ change.
- **Cascading Deletes:** Deletions are generally avoided in favor of `isActive` boolean flags (Soft Deletes), preserving referential integrity for historical orders.

## 2. Prisma Schema Definition

### 2.1 Users & Authentication

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  orders        Order[]
  quotes        Quote[]
  files         File[]
}

enum Role {
  CUSTOMER
  ADMIN
  OPERATOR
}

model Address {
  id          String   @id @default(uuid())
  userId      String
  type        AddressType // SHIPPING, BILLING
  street      String
  city        String
  state       String
  postalCode  String
  country     String   @default("India")

  user        User     @relation(fields: [userId], references: [id])
}
```

### 2.2 Catalog & Inventory Constraints

```prisma
model Material {
  id              String   @id @default(uuid())
  name            String   // e.g., "PETG Carbon Fiber"
  slug            String   @unique
  density         Float    // Grams per cubic centimeter (g/cm³)
  costPerKg       Float    // Used in Quote Engine math
  isActive        Boolean  @default(true)
  technicalSpecs  Json?    // Stores tensile strength, heat resistance

  colors          MaterialColor[]
  printers        PrinterMaterial[]
  quotes          Quote[]
}

model MaterialColor {
  id          String   @id @default(uuid())
  materialId  String
  name        String   // e.g., "Matte Black"
  hexCode     String   // e.g., "#1A1A1A"
  stockStatus StockStatus @default(IN_STOCK)

  material    Material @relation(fields: [materialId], references: [id])
  quotes      Quote[]
}

enum StockStatus {
  IN_STOCK
  LOW_STOCK
  OUT_OF_STOCK
}

model Printer {
  id              String   @id @default(uuid())
  name            String   // e.g., "Bambu Lab X1C - Farm A"
  model           String
  buildVolumeX    Float    // Max width in mm
  buildVolumeY    Float    // Max depth in mm
  buildVolumeZ    Float    // Max height in mm
  hourlyCost      Float    // Used in machine time calculation
  status          PrinterStatus @default(IDLE)

  materials       PrinterMaterial[]
  orders          Order[]  // Historical tracking of which machine printed what
}

enum PrinterStatus {
  IDLE
  PRINTING
  MAINTENANCE
  OFFLINE
}

// Join table: Which printers support which materials
model PrinterMaterial {
  printerId   String
  materialId  String

  printer     Printer  @relation(fields: [printerId], references: [id])
  material    Material @relation(fields: [materialId], references: [id])

  @@id([printerId, materialId])
}
```

### 2.3 Files, Quotes & Order Pipeline

```prisma
model File {
  id              String   @id @default(uuid())
  userId          String
  filename        String
  r2ObjectKey     String   @unique // Cloudflare R2 reference
  volumeCm3       Float    // Extracted from geometry
  surfaceAreaCm2  Float
  boundX          Float
  boundY          Float
  boundZ          Float
  uploadedAt      DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id])
  quotes          Quote[]
}

model Quote {
  id              String   @id @default(uuid())
  userId          String
  fileId          String
  materialId      String
  colorId         String

  layerHeight     Float    // e.g., 0.20
  infill          Int      // e.g., 15 (%)
  quantity        Int      @default(1)

  calculatedPrice Float    // The final evaluated price
  status          QuoteStatus @default(DRAFT)
  createdAt       DateTime @default(now())
  expiresAt       DateTime // Quotes are only valid for a specific duration

  user            User     @relation(fields: [userId], references: [id])
  file            File     @relation(fields: [fileId], references: [id])
  order           Order?   // 1-to-1 relationship if converted
}

enum QuoteStatus {
  DRAFT
  SAVED
  CONVERTED
  EXPIRED
}

model Order {
  id              String   @id @default(uuid())
  userId          String
  quoteId         String   @unique
  printerId       String?  // Assigned by Admin during fulfillment

  status          OrderStatus @default(PENDING)
  trackingNumber  String?

  // Snapshotted Financials
  subtotal        Float
  taxAmount       Float
  shippingAmount  Float
  totalAmount     Float

  razorpayOrderId String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
  quote           Quote    @relation(fields: [quoteId], references: [id])
  printer         Printer? @relation(fields: [printerId], references: [id])
}

enum OrderStatus {
  PENDING           // Awaiting payment verification
  ACCEPTED          // Payment cleared, entering queue
  PRINTING          // Assigned to physical machine
  POST_PROCESSING   // Support removal / QA
  SHIPPED           // Tracking number generated
  CANCELLED
}
```

### 2.4 Configuration & Settings (The OS)

```prisma
model PricingRule {
  id          String   @id @default(uuid())
  key         String   @unique // e.g., "PROFIT_MARGIN_PERCENTAGE", "FAILURE_BUFFER"
  value       Float
  type        RuleType
  description String?
}

enum RuleType {
  MULTIPLIER
  FLAT_FEE
}

model SiteSetting {
  id          String   @id @default(uuid())
  key         String   @unique // e.g., "MAINTENANCE_MODE", "SITE_NAME"
  value       String   // Stored as string, parsed by application based on key
}

model FeatureToggle {
  id          String   @id @default(uuid())
  name        String   @unique // e.g., "ENABLE_NEW_UPLOADS"
  isEnabled   Boolean  @default(true)
}
```

## 3. Indexing Strategy

- `@unique` constraints applied to Slugs, Emails, and Razorpay Order IDs.
- Foreign keys (e.g., `userId`, `materialId`) will have BTREE indexes generated by PostgreSQL to ensure fast relational lookups when joining Tables for the Admin Dashboard grids.
