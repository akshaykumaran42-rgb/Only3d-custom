export const ISearchServiceToken = Symbol("ISearchService");
export interface ISearchService {
  index(
    indexName: string,
    id: string,
    document: Record<string, unknown>,
  ): Promise<void>;
  search<T>(indexName: string, query: string): Promise<T[]>;
}
