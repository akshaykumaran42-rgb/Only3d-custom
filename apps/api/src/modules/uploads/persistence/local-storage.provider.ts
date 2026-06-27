import { Injectable, Logger } from "@nestjs/common";
import { IStorageProvider } from "../application/storage.provider.interface";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly storageDir: string;

  constructor() {
    this.storageDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async save(
    filename: string,
    buffer: Buffer,
    _mimeType: string,
  ): Promise<string> {
    const storageKey = `${Date.now()}-${filename}`;
    const fullPath = path.join(this.storageDir, storageKey);
    await fs.promises.writeFile(fullPath, buffer);
    this.logger.log(`Saved file to ${fullPath}`);
    return storageKey;
  }

  async get(storageKey: string): Promise<Buffer> {
    const fullPath = path.join(this.storageDir, storageKey);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${storageKey}`);
    }
    return fs.promises.readFile(fullPath);
  }

  async delete(storageKey: string): Promise<void> {
    const fullPath = path.join(this.storageDir, storageKey);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      this.logger.log(`Deleted file ${fullPath}`);
    }
  }
}
