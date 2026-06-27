# 16 Operations & Monitoring

Software running a physical manufacturing floor must be highly observable. This document defines how we monitor the health of the Only3D platform.

## 1. Application Logging (Winston + Datadog/Axiom)

`console.log` is insufficient for a production NestJS backend. We will implement a structured logging service (e.g., Winston).

- **Format:** All logs output as structured JSON.
- **Context:** Every log entry must include the `traceId`, `userId` (if authenticated), and `endpoint`.
- **Levels:**
  - `ERROR`: System failures (e.g., Database connection lost). Triggers immediate alerts.
  - `WARN`: Recoverable issues (e.g., R2 upload took too long, Razorpay webhook signature mismatch).
  - `INFO`: Standard lifecycle events (e.g., "Order 102 transitioned to SHIPPED").
  - `DEBUG`: Quote Engine math breakdowns (disabled in production).

## 2. Uptime Monitoring

- We will configure an external service (e.g., BetterStack or PagerDuty) to ping `/api/health` every 1 minute.
- The `/api/health` endpoint verifies the database connection and R2 connectivity. If either fails, it returns `503 Service Unavailable`, triggering an SMS to the engineering team.

## 3. Business Logic Alerts

Technical monitoring is not enough; we must monitor business anomalies.

- **Stale Orders:** If an Order remains in the `PENDING` state for > 24 hours, an alert is sent to the Admin team (indicating a potential Razorpay webhook failure).
- **High-Value Quote:** If a quote exceeds ₹50,000, trigger a Slack notification to the Sales team to offer high-touch customer support.
- **Printer Downtime:** If a physical printer remains in `MAINTENANCE` state for > 48 hours, alert the operations manager.

## 4. Analytics & Telemetry

While Google Analytics tracks basic web traffic, we need operational telemetry.

- **Quote Conversion Rate:** We will track the ratio of `Quotes Generated` to `Orders Placed`. If this drops suddenly, it may indicate our Pricing Rules (`08_QUOTE_ENGINE.md`) are too aggressive.
- **Material Velocity:** A dashboard in the Admin OS tracking how fast specific materials (e.g., Black PETG) are being consumed, enabling just-in-time filament ordering for the physical factory.
