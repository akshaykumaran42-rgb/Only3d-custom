# 06 Admin Panel Design Specification

This document details the interface and logic for the Admin OS, utilized by factory operators and business managers to run Only3D.
_UI inspiration: Linear and Raycast (Dense, fast, keyboard-first)._

## 1. Global Navigation & Layout

- **Layout:** Persistent left sidebar (collapsible). Top bar with global search (Command Palette invoked via `CMD+K`).
- **Command Palette (`CMD+K`):** Instantly jump to any order (e.g., typing "Order #4092" jumps to the detail view), search for a customer, or jump to a configuration screen.

## 2. Fulfillment Module (The Factory Floor)

The most frequently used screen. Must update via WebSockets or polling (SWR/React Query) so operators see new orders instantly.

### 2.1 Order Queue (Kanban / Data Grid)

- **View:** Sortable data table.
- **Columns:** Order ID, Status Badge, Customer Name, Due Date, Material, Printer ID (if assigned).
- **Filtering:** Multi-select filters for Status (e.g., "Show me only PENDING").

### 2.2 Order Detail Drawer

Clicking a row slides open a massive drawer (so context isn't lost).

- **Top Section:** Customer details, Shipping Address, and current Status dropdown.
- **3D Viewer:** WebGL canvas displaying the actual uploaded model for visual QA.
- **Specs:** Material, Color, Infill, Layer Height.
- **Action Panel:**
  - Dropdown to assign physical `Printer ID`.
  - Button to "Download STL" (generates short-lived R2 signed URL).
  - Input for Courier Tracking Number (activates when status is set to `SHIPPED`).

## 3. Configuration Modules (The Brain)

### 3.1 Material & Color Inventory

- **Materials Table:** Columns for Name, Density, Cost/Kg, Status.
- **Colors Sub-Table:** Clicking a material expands its colors. Operators toggle `StockStatus` (IN_STOCK / OUT_OF_STOCK) here. If a color goes out of stock, it instantly disappears from the public Quote Engine.

### 3.2 Pricing Math Editor

- **Interface:** A simple list of global variables pulled from the `PricingRule` table.
- **Inputs:** `Base Handling Fee` (₹), `Electricity per kWh` (₹), `Failure Margin Buffer` (%), `Profit Margin` (%).
- **Validation:** Strict numerical validation to prevent accidental zeroing out of profit margins.

### 3.3 Printer Fleet Manager

- **Interface:** Grid of "Printer Cards".
- **Card Data:** Name, Max Volume (X,Y,Z), Hourly Running Cost.
- **Status Toggle:** If a physical printer jams, the Admin toggles it to `MAINTENANCE`. The Quote Engine (`08_QUOTE_ENGINE.md`) will evaluate if the remaining fleet can handle large bounding boxes.

## 4. Content Management (CMS)

### 4.1 Homepage Builder

- **Interface:** Block-based vertical list.
- **Blocks:** Hero, Feature Grid, Testimonials.
- **Editing:** Admins edit JSON properties via intuitive form fields (Headline, Subheadline, Image URL). The Next.js frontend fetches this JSON to render the UI.

### 4.2 Feature Toggles

- **Interface:** Simple list of switches.
- **Critical Toggles:** `ENABLE_CHECKOUT`, `ENABLE_UPLOADS`. Useful for pausing the business during massive factory maintenance.

---

_Refer to `04_DATABASE.md` to see the underlying Prisma models powering these views._
