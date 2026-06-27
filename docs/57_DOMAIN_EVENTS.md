# DOMAIN EVENTS

Domain Events decouple feature modules. Instead of the `OrdersService` calling the `InventoryService` directly to subtract material (which couples the modules), the `OrdersService` publishes an `OrderPaidEvent`. The `InventoryService` listens to this event.

## Planned Event Contracts

The following core events are defined in the architecture:

### Identity

- `UserRegisteredEvent`
- `UserRoleChangedEvent`

### Quoting & Orders

- `QuoteCreatedEvent`
- `QuoteAcceptedEvent`
- `OrderCreatedEvent`
- `PaymentSucceededEvent`
- `OrderShippedEvent`
- `OrderDeliveredEvent`

### Manufacturing

- `ManufacturingJobQueuedEvent`
- `ManufacturingJobStartedEvent`
- `ManufacturingJobCompletedEvent`
- `ManufacturingJobFailedEvent`

### Inventory

- `InventoryAdjustedEvent`
- `StockAlertTriggeredEvent`

## Implementation

All events extend `BaseDomainEvent` located in `src/core/events/`.
They are published via the `IEventBus` interface, allowing future implementations to swap local memory buses (Node `EventEmitter`) for distributed buses (Kafka, RabbitMQ, Redis PubSub) without altering business logic.
