import { QuoteInputSnapshot } from "./quote.entity";

export interface IQuoteDataProvider {
  getQuoteInputData(
    uploadId: string,
    materialId: string,
    printerProfileId: string,
  ): Promise<QuoteInputSnapshot>;
}
