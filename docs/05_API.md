# 05 API Design

This document details the RESTful API contracts implemented in NestJS. All endpoints accept and return `application/json`. Zod is used for runtime validation of all request bodies (defined in `packages/types`).

## 1. Authentication (`/api/auth`)

_Refer to `13_SECURITY_MODEL.md` for JWT token lifecycle._

### 1.1 Login

- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  { "email": "user@domain.com", "password": "secure_password" }
  ```
- **Response (200 OK):**
  Sets `HttpOnly` cookie containing the JWT. Returns `{ "user": { "id", "role" } }`.

## 2. Customer Operations (`/api/customer`)

Requires valid JWT with `Role = CUSTOMER` or `ADMIN`.

### 2.1 Get Upload Pre-signed URL

To prevent server bottlenecking on large STL files, clients request an R2 signature.

- **Endpoint:** `POST /api/customer/files/presign`
- **Request Body:**
  ```json
  {
    "filename": "engine_block.stl",
    "contentType": "model/stl",
    "sizeBytes": 45000000
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "uploadUrl": "https://r2.cloudflare.com/...signature...",
    "r2ObjectKey": "uuid-engine_block.stl"
  }
  ```

### 2.2 Register Uploaded File

Called by the client after a successful PUT to the R2 `uploadUrl`.

- **Endpoint:** `POST /api/customer/files/register`
- **Request Body:**
  ```json
  { "r2ObjectKey": "uuid-engine_block.stl" }
  ```
- **Response (201 Created):**
  Triggers geometry parsing. Returns `File` entity including calculated `volumeCm3` and bounding box.

### 2.3 Calculate Quote (The Engine)

_Refer to `08_QUOTE_ENGINE.md` for mathematical validation rules._

- **Endpoint:** `POST /api/customer/quotes/calculate`
- **Request Body:**
  ```json
  {
    "fileId": "uuid-1234",
    "materialId": "uuid-petg",
    "colorId": "uuid-black",
    "layerHeight": 0.2,
    "infill": 15,
    "quantity": 2
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "calculatedPrice": 45.5,
    "breakdown": {
      "materialCost": 12.0,
      "machineCost": 25.0,
      "handlingFee": 5.0,
      "tax": 3.5
    },
    "isPrintable": true
  }
  ```

## 3. Admin Operations (`/api/admin`)

Requires valid JWT with `Role = ADMIN`. Requests lacking this role return `403 Forbidden`.

### 3.1 Update Pricing Rule

- **Endpoint:** `PATCH /api/admin/pricing-rules/:id`
- **Request Body:**
  ```json
  { "value": 1.25 } // e.g., updating profit margin to 25%
  ```
- **Response (200 OK):** Updated `PricingRule` entity. Note: Does _not_ affect historical quotes or orders.

### 3.2 Transition Order State

Moves an order through the manufacturing state machine.

- **Endpoint:** `PATCH /api/admin/orders/:id/status`
- **Request Body:**
  ```json
  {
    "status": "SHIPPED",
    "trackingNumber": "AWB123456789"
  }
  ```
- **Response (200 OK):** Updated `Order` entity.
- **Side Effects:** Dispatches event to Mailer service to notify the customer.

## 4. Standard Response Formats

### Success (2xx)

```json
{
  "data": { ... },
  "meta": { "pagination": { "total": 100, "page": 1 } } // If applicable
}
```

### Error (4xx / 5xx)

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Infill must be between 0 and 100",
    "details": [{ "path": "infill", "issue": "Too high" }]
  }
}
```
