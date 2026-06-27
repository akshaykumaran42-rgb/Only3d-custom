# 07 Customer Dashboard Specification

This document details the private portal where customers manage their intellectual property and track manufacturing jobs.
_UI inspiration: Vercel & Stripe (Minimal, trusting, data-forward)._

## 1. Authentication & Onboarding

- **Access:** Protected by Next.js Middleware checking for a valid JWT.
- **Onboarding:** New users (who registered during checkout) land here. A brief welcome banner introduces the asset library.

## 2. Dashboard Overview

- **Layout:** 12-column grid.
- **Top KPI Bar:**
  - Active Orders (Count)
  - Total Spent (₹)
  - Saved Models (Count)
- **Recent Activity:** A timeline view of the last 5 order state changes (e.g., "Order #102 is now Printing").

## 3. Order Tracking

- **The List:** A clean table showing Order ID, Date, Total, and Status.
- **Status Badges:**
  - `PENDING` (Gray)
  - `PRINTING` (Blue)
  - `POST_PROCESSING` (Purple)
  - `SHIPPED` (Green)
- **Order Detail View:**
  - A progress bar visualizing the state machine.
  - If `SHIPPED`, a prominent link to the Courier Tracking URL.
  - **Financials:** Detailed breakdown (Subtotal, Tax, Shipping) matching `08_QUOTE_ENGINE.md`.
  - **Invoice:** "Download PDF" button. (PDF generated on the backend using Puppeteer or PDFKit).

## 4. Asset Library (Saved Models)

Crucial for B2B retention. Engineers re-order the same parts frequently.

- **Visual Grid:** Cards displaying a thumbnail of the STL, filename, and dimensions ($X \times Y \times Z$).
- **Metadata:** Upload date, Volume ($cm^3$).
- **Actions:**
  1.  **"Quote"**: Immediately redirects to the Quote Engine with this `fileId` pre-populated.
  2.  **"Delete"**: Soft-deletes the file record, preventing it from showing in the UI, and queues an R2 bucket deletion.

## 5. Account Settings

- **Profile:** Update Name and Email.
- **Security:** Password reset flow.
- **Address Book:** Manage an array of addresses.
  - _Validation:_ Enforce strict ZIP code and State validation for India.
- **Notification Preferences:** Checkboxes to opt-in/out of "Order Status Email Updates".

## 6. Edge Cases & States

- **Empty States:** If a user has no orders, display a beautifully designed empty state with a primary CTA: "Get your first instant quote".
- **Loading States:** Use skeleton screens for the Asset Library grid while fetching from the NestJS API to prevent layout shift.
