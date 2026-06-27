# 25 Event Architecture & Messaging

## 1. Purpose

Defines how disparate domains within the Only3D platform communicate without tight coupling.

## 2. Scope

Covers Domain Events (internal NestJS) and Webhooks (external).

## 3. Responsibilities

- Ensure that when an Order state changes, secondary actions (like sending an email or updating analytics) happen asynchronously.

## 4. Dependencies

- `21_DOMAIN_MODEL.md` (Event Emitters)
- `28_BACKGROUND_JOBS.md` (Event Consumers)

## 5. Event Flow Diagram

```mermaid
graph TD
    OrderSvc[Order Service]
    EventBus((Node.js EventEmitter))
    EmailWorker[Email Worker]
    AnalyticsWorker[Analytics Worker]
    WebSockets[WebSocket Gateway]

    OrderSvc -->|emit('order.shipped')| EventBus
    EventBus --> EmailWorker
    EventBus --> AnalyticsWorker
    EventBus --> WebSockets
```

## 6. Core Events

- `order.created`: Emitted when Razorpay verification succeeds. Triggers email confirmation and factory queue update.
- `order.status_changed`: Emitted by Admin actions. Triggers push notifications to the Customer Portal via WebSockets.
- `file.uploaded`: Emitted when R2 upload completes. Triggers the Geometry Parser.

## 7. Failure Scenarios

- If the `EmailWorker` fails to send an email on `order.status_changed`, the core Order Service must _not_ fail. The order state transition must commit to the DB successfully regardless of secondary event failures.

## 8. Future Scalability

- Currently utilizing NestJS's internal `EventEmitter2`. As the system scales to microservices, this will be replaced with a distributed message broker like Kafka or RabbitMQ.

## 9. Risks

- **Event Loss:** Node.js internal events are in-memory. If the server crashes after emitting but before the worker processes it, the event is lost. **Mitigation:** For critical events, use persistent queues (Redis/BullMQ) as defined in `26_BACKGROUND_JOBS.md`.

## 10. Open Questions

- None.

## 11. Cross References

- `26_BACKGROUND_JOBS.md`
