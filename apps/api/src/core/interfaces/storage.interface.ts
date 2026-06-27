export const IStorageServiceToken = Symbol("IStorageService");
export interface IStorageService {
  upload(key: string, file: Buffer): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string): Promise<string>;
}
