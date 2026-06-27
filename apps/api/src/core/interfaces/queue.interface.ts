export const IQueueServiceToken = Symbol("IQueueService");
export interface IQueueService {
  publish<T>(queue: string, payload: T): Promise<void>;
}
