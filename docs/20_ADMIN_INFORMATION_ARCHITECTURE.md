# 20 Admin Information Architecture (IA)

This document maps every route, page, and module relationship within the Admin OS (`apps/web/app/admin/*`).

## 1. Routing Tree

```text
/admin
├── / (Dashboard)
│   └── Overview widgets (Revenue, Printer Utilization).
├── /orders
│   ├── / (Kanban Board & List View)
│   └── /[id] (Detailed Order Drawer - loaded via URL state)
├── /fleet (Printer Management)
│   ├── / (Grid of all physical printers)
│   └── /new (Add new hardware)
├── /catalog
│   ├── /products (Manage standard SKUs)
│   ├── /categories (Taxonomy)
│   └── /materials
│       ├── / (List of materials: PLA, PETG)
│       └── /[id]/colors (Manage hex codes and stock)
├── /pricing (The Core Engine Controls)
│   └── / (Global multiplier inputs)
├── /customers
│   ├── / (CRM Table)
│   └── /[id] (Customer History & LTV)
├── /marketing
│   └── /coupons (Discount engine)
├── /cms
│   ├── /homepage (Block builder)
│   ├── /pages (Static pages)
│   └── /media (R2 File browser for images)
└── /settings
    ├── /general (Business name, contact)
    └── /toggles (Feature flags)
```

## 2. Page-Level Actions & State Mutations

### `/admin/orders`

- **View:** Displays all `Order` entities.
- **Actions:**
  - `UpdateStatus(orderId, newStatus)`
  - `AssignPrinter(orderId, printerId)`
  - `AttachTracking(orderId, trackingNumber)`
- **Dependencies:** Requires data from `Users` (Customer Info) and `Printers` (for assignment dropdown).

### `/admin/pricing`

- **View:** Displays all `PricingRule` entities.
- **Actions:**
  - `UpdateRule(ruleKey, newValue)`
- **Critical Impact:** Any change here immediately mutates the output of `/api/customer/quotes/calculate`.

### `/admin/catalog/materials/[id]/colors`

- **View:** Displays `MaterialColor` entities for a specific `Material`.
- **Actions:**
  - `ToggleStock(colorId, newStatus)`
- **Critical Impact:** Setting a color to `OUT_OF_STOCK` instantly hides it from the Customer Quote Engine UI.

## 3. Navigation UX (The Command Palette)

Because the IA is deep, the sidebar navigation is secondary to the `cmdk` Command Palette.

- Typing `G P` (Go to Pricing) redirects to `/admin/pricing`.
- Typing `O 1042` searches for Order ID 1042 and opens the drawer.
- This ensures power users never get lost in the routing tree.
