# 02 Product Requirements Document (PRD)

This document serves as the exhaustive functional blueprint for the Only3D platform. It is strictly tied to the database schema defined in `04_DATABASE.md` and the UI principles defined in `09_DESIGN_SYSTEM.md`.

## 1. Public Website Module

The Public Website is statically generated (SSG) or server-rendered (SSR) via Next.js for absolute maximum SEO performance and LCP (Largest Contentful Paint).

### 1.1 Homepage

- **Requirement:** Must be fully dynamic. Hardcoded marketing copy is prohibited.
- **Features:**
  - Dynamic Hero Section (Headline, Subheadline, CTA buttons).
  - Feature Grid (Highlighting speed, quality, materials).
  - Testimonials carousel.
- **Data Source:** Driven by the `Homepage_Sections` table.

### 1.2 Catalog (Products & Categories)

- **Requirement:** Display predefined manufacturing services or specific parts.
- **Features:**
  - Hierarchical category navigation (e.g., Industrial Parts -> Gears).
  - Product detail pages (PDP) with high-res imagery, base pricing, and technical descriptions.
- **Data Source:** Driven by `Products` and `Categories` tables.

### 1.3 Material Library

- **Requirement:** Educational hub to assist engineers in selecting the correct filament/resin.
- **Features:**
  - Filterable grid of active materials.
  - Detail pages showing Mechanical Properties (Tensile Strength, Heat Deflection Temperature) stored as JSONB.
  - List of available colors per material based on live `Material_Colors` stock levels.
- **Data Source:** Driven by `Materials` table.

### 1.4 Instant Quote Flow (Core Application)

- **Requirement:** A frictionless, SPA-like experience for quoting custom geometry.
- **Features:**
  - **Upload Zone:** Drag-and-drop target accepting `.stl` and `.3mf` files (Max size: 100MB).
  - **Geometry Parser:** Extracts Bounding Box (X, Y, Z), Surface Area, and Volume.
  - **Configurator:** Form inputs for Material, Color, Printer Type, Layer Height, Infill, and Quantity.
  - **Live Price:** Debounced API calls to `/api/customer/quotes/calculate` to update the price in real-time as parameters change.
- **Constraints:** If the bounding box exceeds the largest active printer's volume, the UI must gracefully block the quote and prompt for manual review.

### 1.5 Checkout

- **Requirement:** Secure, highly trusted payment flow.
- **Features:**
  - Capture Shipping and Billing addresses (validate via Zod schemas).
  - Apply Coupon codes (validating expiry and limits).
  - Razorpay SDK integration for capturing payment.
  - On success, redirect to Customer Portal order confirmation.

## 2. Customer Portal Module

The secure, authenticated application for clients. Requires JWT validation (`13_SECURITY_MODEL.md`).

### 2.1 Dashboard & Overview

- **Requirement:** Immediate situational awareness of active manufacturing jobs.
- **Features:** List of orders in `PENDING`, `PRINTING`, or `POST_PROCESSING` states.

### 2.2 Order Management

- **Requirement:** Full historical record of transactions.
- **Features:**
  - Paginated table of all orders.
  - Order Detail View: Shows exact parameters (Infill, Material) requested, physical tracking number, and a downloadable PDF Invoice.

### 2.3 Asset Library (Saved Models)

- **Requirement:** Secure storage of client IP (Intellectual Property).
- **Features:**
  - Visual grid of all successfully uploaded 3D models.
  - Ability to delete models (soft delete in DB, trigger R2 cleanup via queue).
  - "1-Click Requote" button to push a saved model directly into the Quote Engine.

### 2.4 Profile & Settings

- **Requirement:** Standard user management.
- **Features:** Update Name, Password, and manage saved Address book.

## 3. Admin Dashboard Module (The OS)

The internal operating system. Only accessible to users with the `ADMIN` role.

### 3.1 Order Fulfillment Queue

- **Requirement:** The operational heart of the physical factory.
- **Features:**
  - Advanced data grid (sortable, filterable by status, date, material).
  - **Order Action Drawer:**
    - Download the STL/3MF file via signed R2 URL.
    - Manually assign the order to a physical `PrinterId`.
    - Transition the State Machine (`PENDING` -> `PRINTING` -> `SHIPPED`).
    - Input Courier Tracking Number.

### 3.2 Pricing & Math Engine Controls

- **Requirement:** Complete control over the variables dictating the algorithm in `08_QUOTE_ENGINE.md`.
- **Features:**
  - Input fields for global `Profit Margin %`, `Failure Buffer %`, `Electricity Cost / kWh`.
  - Changes must immediately affect all future quotes (historical quotes remain immutable).

### 3.3 Fleet Management (Printers)

- **Requirement:** Digital twin of the physical production floor.
- **Features:**
  - CRUD operations for physical printers.
  - Define Max Volume constraints ($X, Y, Z$).
  - Toggle printer status to `MAINTENANCE` to exclude it from capacity calculations.

### 3.4 Catalog & Material Management

- **Requirement:** Manage the physical inventory constraints.
- **Features:**
  - Add/Edit Materials. Define the critical `Density (g/cm³)` and `Cost per kg` variables.
  - Add/Edit Colors linked to specific materials. Toggle stock status (`IN_STOCK`, `OUT_OF_STOCK`).

### 3.5 CMS (Content Management System)

- **Requirement:** Ability to mutate the public website without engineering support.
- **Features:**
  - **Homepage Builder:** Reorder and edit JSON blocks representing hero sections and feature grids.
  - **Media Library:** Upload and retrieve marketing images from Cloudflare R2.
  - **Blog/Pages:** Markdown editor for writing technical posts.

### 3.6 System Settings & Toggles

- **Requirement:** Emergency controls and global variables.
- **Features:**
  - Enable/Disable `MAINTENANCE_MODE`.
  - Toggle `ALLOW_NEW_ORDERS`.
  - Configure automated Email Template subjects/bodies (e.g., "Your order has shipped!").

---

_Refer to `06_ADMIN.md` for Admin UI specifics and `07_CUSTOMER.md` for Customer UI specifics._
