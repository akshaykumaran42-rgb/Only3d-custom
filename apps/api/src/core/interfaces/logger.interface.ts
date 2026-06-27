export const ILoggerServiceToken = Symbol("ILoggerService");
export interface ILoggerService {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
}
