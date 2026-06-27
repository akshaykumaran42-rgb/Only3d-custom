# 13 Security Model & Authentication

This document outlines the security perimeter for Only3D. Because we handle physical manufacturing and process financial transactions, the security posture must be rigorous.

## 1. Authentication Strategy (JWT)

Only3D relies on stateless JSON Web Tokens (JWT) issued by the NestJS backend.

### 1.1 Token Lifecycle

1.  **Login:** User submits credentials to `/api/auth/login`.
2.  **Validation:** NestJS verifies against `passwordHash` (Argon2 or bcrypt).
3.  **Issuance:** NestJS issues an `HttpOnly`, `Secure`, `SameSite=Strict` cookie containing the JWT.
    - _Why HttpOnly?_ Prevents Cross-Site Scripting (XSS) attacks from stealing the token. Next.js Client Components cannot read this cookie.
4.  **Payload:** The JWT payload contains only non-sensitive identifiers: `{ sub: "userId", role: "CUSTOMER" }`.
5.  **Expiration:** Tokens expire every 24 hours to mitigate session hijacking.

## 2. Role-Based Access Control (RBAC)

Enforced at the NestJS route level using custom Guards (`@Roles('ADMIN')`).

- **GUEST:** Can access public endpoints (`GET /api/public/products`, `POST /api/customer/quotes/calculate` if unauthenticated quoting is allowed).
- **CUSTOMER:** Can access `/api/customer/*`. Can only read/write `Order` or `File` entities where `entity.userId === currentUser.id`.
- **ADMIN:** Can access `/api/admin/*`. Has global read/write access.

## 3. Cloudflare R2 Asset Security

Customers upload proprietary 3D CAD files. These represent valuable Intellectual Property (IP) and must never be public.

### 3.1 Upload Security

1.  Uploads are _never_ sent through NestJS (prevents memory exhaustion).
2.  NestJS generates an AWS v4 Pre-signed URL valid for exactly 15 minutes.
3.  The Next.js client uploads directly to R2.

### 3.2 Download Security

1.  The R2 bucket is strictly `Private`.
2.  When an Admin needs to view an STL, they request a download URL from NestJS.
3.  NestJS verifies their `ADMIN` role and generates a Pre-signed GET URL valid for 5 minutes.

## 4. Payment Security (Razorpay)

- **Never trust the client.** The Next.js frontend is easily manipulated.
- When a payment completes, Razorpay sends a Webhook to `POST /api/customer/orders/verify`.
- NestJS cryptographically verifies the `x-razorpay-signature` header using the webhook secret stored in `.env`. Only then is the Order status changed to `ACCEPTED`.

## 5. Input Validation

- All incoming API payloads are parsed through **Zod**. If a user tries to submit an `infill` of 500%, Zod rejects it before it reaches the core logic.
- SQL Injection is mitigated natively by the **Prisma ORM**.
