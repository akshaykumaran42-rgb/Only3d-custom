export abstract class DomainEvent {
  public readonly occurredOn: Date;
  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
