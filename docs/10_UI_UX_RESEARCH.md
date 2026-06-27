# 10 UI/UX Research Log

This document records the specific UX patterns extracted from industry leaders to synthesize the Only3D design language. _Rule: We do not copy; we distill the best UX principles._

## 1. Manufacturing & Hardware UX

### 1.1 Xometry & Protolabs (MaaS Leaders)

- **Extraction:** The Instant Quote interface must be a unified, single-page application (SPA). When a user changes the Material from PLA to Nylon, the price must update on the screen in `< 100ms` without a page reload.
- **Actionable:** We will build the `QuoteEngine` UI as a client-side React component heavily relying on optimistic UI updates while the NestJS backend recalculates.

### 1.2 Bambu Lab & Prusa

- **Extraction:** Hardware is visual. Product pages must prioritize high-resolution, macro-photography of 3D printed layers to build trust in print quality.
- **Actionable:** The Public Website `Product` pages will utilize full-bleed imagery and dark mode contrast to highlight the sheen of the printed plastics.

### 1.3 PCBWay

- **Extraction:** Complex technical forms (layer counts, infill, surface finish) can easily overwhelm users. PCBWay organizes these into dense, logical groups.
- **Actionable:** The Only3D Quote configurator will group parameters: [Basic] (Material, Color), [Advanced] (Layer Height, Infill), [Post-Processing] (Sanding, Painting).

## 2. Premium Software UX

### 2.1 Linear & Raycast (Admin Inspiration)

- **Extraction:** Mouse travel is wasted time for power users.
- **Actionable:** The Only3D Admin Dashboard (`06_ADMIN.md`) will implement a global Command Palette (`CMD+K`) built with `cmdk`. Operators can press `CMD+K`, type "Approve 1042", and hit enter to transition an order without touching the mouse.

### 2.2 Stripe (Checkout & Trust)

- **Extraction:** Checkout must feel native, fast, and mathematically transparent.
- **Actionable:** The invoice breakdown in the checkout flow will explicitly show `Subtotal`, `Tax`, and `Shipping` with pixel-perfect alignment. Error states on credit card inputs will use Stripe's subtle horizontal shake animation.

### 2.3 Vercel & GitHub (Customer Dashboard)

- **Extraction:** Dashboards should be monochrome, relying on bold layout and whitespace rather than color for hierarchy. Color is reserved exclusively for state (Green = Success, Red = Error).
- **Actionable:** The `07_CUSTOMER.md` dashboard will be heavily grayscale. The only colors will be the Order Status badges.

## 3. Micro-Interaction Rules

- **Empty States (Figma inspired):** Instead of a blank screen, empty states (e.g., "No orders yet") will feature a subtle, wireframe-style illustration and a clear, primary CTA.
- **Loading States (GitHub inspired):** Use animated skeleton loaders that exactly match the width and height of the text/images that will replace them, ensuring zero Cumulative Layout Shift (CLS).
