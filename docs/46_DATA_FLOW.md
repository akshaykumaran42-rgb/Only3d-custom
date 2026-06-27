# DATA FLOW

## 1. File Upload & Analysis Flow

1. **Customer** uploads an STL/3MF file.
2. The UI pushes the file to S3, returning a URL to the Backend.
3. The Backend creates an `UploadedFile` record.
4. An async job analyzes the geometry, resulting in a `FileAnalysis` record and multiple `FilePreview`s.

## 2. Quoting & Ordering Flow

1. **Customer** selects an `UploadedFile`, a `MaterialColor`, and slicing parameters (Infill, Layer Height).
2. The system computes volume and time.
3. A `Quote` and `QuoteItem` are generated with `status: DRAFT`.
4. The Customer approves and proceeds to checkout.
5. The `Quote` transitions to `CONVERTED`.
6. An `Order` and `OrderItem`s are generated. A `PaymentTransaction` is logged (`status: PENDING`).
7. Upon webhook success, `PaymentTransaction` transitions to `SUCCESS`, and the `Order` transitions to `PAID`.

## 3. Manufacturing Flow

1. The system detects a `PAID` order.
2. For each `OrderItem`, it spawns a `ManufacturingJob` (`status: QUEUED`).
3. The Admin assigns a `Printer` to the job.
4. The physical spool of `MaterialColor` is weighed. An `InventoryMovement` subtracts the estimated weight from the `FilamentSpool`.
5. If the `FilamentSpool` drops below threshold, a `StockAlert` is fired.
6. The job finishes, `status` updates to `COMPLETED`.
7. Once all `ManufacturingJob`s for an `Order` are completed, the `Order` transitions to `READY_FOR_PICKUP` or `PARTIALLY_SHIPPED`.

## 4. Fulfillment Flow

1. Admin packages the order.
2. A `Shipment` is created linked to the Customer's `Address`.
3. The `Shipment` updates via webhook tracking, eventually marking the `Order` as `DELIVERED`.
