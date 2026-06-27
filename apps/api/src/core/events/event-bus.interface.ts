import { DomainEvent } from "./domain-event";
export const IEventBusToken = Symbol("IEventBus");
export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
