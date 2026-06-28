import { QuoteEntity } from "./quote.entity";

export interface IQuoteRepository {
  findById(id: string): Promise<QuoteEntity | null>;
  findAll(options?: {
    customerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<QuoteEntity[]>;
  save(quote: QuoteEntity): Promise<QuoteEntity>;
}
