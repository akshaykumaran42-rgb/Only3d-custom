export interface IStorageProvider {
  /**
   * Saves a file to storage and returns the storage key.
   */
  save(filename: string, buffer: Buffer, mimeType: string): Promise<string>;

  /**
   * Retrieves a file from storage as a buffer.
   */
  get(storageKey: string): Promise<Buffer>;

  /**
   * Deletes a file from storage.
   */
  delete(storageKey: string): Promise<void>;
}
