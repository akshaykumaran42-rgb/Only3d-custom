# 39 Monitoring & Observability

## 1. Purpose

Provides absolute visibility into the health of the hardware (Printers), the software (API/Web), and the business (Sales velocity).

## 2. Scope

Covers Application Performance Monitoring (APM), Custom Metrics, and Alerting logic.

## 3. Responsibilities

- **Datadog/Sentry:** APM and error tracking.
- **NestJS:** Emits custom metric events (e.g., `OrderValue`, `PrintFailureReason`).

## 4. Dependencies

- `35_LOGGING_AUDIT.md` (Log formatting)
- `28_MANUFACTURING_WORKFLOW.md` (State transitions)

## 5. Telemetry Data Flow

```mermaid
graph TD
    NestJS[NestJS API] -->|StatsD / UDP| DatadogAgent[Datadog Agent]
    NextJS[Next.js Client] -->|HTTP| Sentry[Sentry (Client Errors)]

    DatadogAgent --> DatadogCloud[Datadog Cloud]

    DatadogCloud -->|P99 Latency > 2s| PagerDuty[PagerDuty Alert]
    DatadogCloud -->|Order Volume drops 50%| Slack[Slack Business Alert]
```

## 6. Core Metrics Tracked

- **System:** CPU/Memory usage of Node.js event loop, Postgres active connections, Redis queue depth.
- **Performance:** `CalculateQuote` execution time (Must remain < 100ms).
- **Business:**
  - Conversion Rate (Quotes generated vs Orders paid).
  - Material Velocity (Grams of plastic consumed per hour).
  - Printer Yield (Percentage of prints that pass QA).

## 7. Failure Scenarios

- If Datadog is unreachable, the NestJS agent buffers metrics in memory. If memory exceeds 50MB, it drops metrics to prevent OOM crashing the main API.

## 8. Future Scalability

- Implementing OpenTelemetry (OTel) standard tracing so we are not locked into Datadog, allowing migration to open-source alternatives like Grafana/Prometheus.

## 9. Risks

- **Alert Fatigue:** If engineers receive alerts for every minor network blip, they will ignore critical warnings. _Mitigation:_ Alerts are strictly categorized. PagerDuty (SMS) is _only_ for `Database Down` or `Checkout Down`.

## 10. Open Questions

- None.

## 11. Cross References

- `16_OPERATIONS_MONITORING.md`
