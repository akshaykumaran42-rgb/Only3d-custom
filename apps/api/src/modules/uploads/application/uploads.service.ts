import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { IUploadRepository } from "../domain/upload.repository.interface";
import { IStorageProvider } from "./storage.provider.interface";
import { UploadEntity } from "../domain/upload.entity";
import { ModelAnalysisEntity } from "../domain/model-analysis.entity";
import { AnalysisService } from "./analysis.service";
import { createHash } from "crypto";
import * as path from "path";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
export const ALLOWED_EXTENSIONS = [".stl", ".3mf"];
export const ALLOWED_MIME_TYPES = [
  "model/stl",
  "application/vnd.ms-pki.stl",
  "model/3mf",
  "application/octet-stream",
];

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(
    @Inject("IUploadRepository") private readonly repo: IUploadRepository,
    @Inject("IStorageProvider") private readonly storage: IStorageProvider,
    @Inject(AnalysisService) private readonly analysisService: AnalysisService,
  ) {}

  async processUpload(
    file: Express.Multer.File,
    customerId?: string,
  ): Promise<UploadEntity> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("File is too large");
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw new BadRequestException(`Unsupported file extension: ${extension}`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      // Browsers often send application/octet-stream for 3d models, so we allow it,
      // but in a stricter setup we'd use magic numbers.
      this.logger.warn(`Mime type ${file.mimetype} may not be specific enough`);
    }

    const checksumSHA256 = createHash("sha256")
      .update(file.buffer)
      .digest("hex");
    const existing = await this.repo.findByChecksum(checksumSHA256);
    if (existing) {
      throw new BadRequestException(
        "Duplicate file upload detected (matching SHA-256)",
      );
    }

    // Save to storage
    const storageKey = await this.storage.save(
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    // Create DB Record
    const upload = UploadEntity.create({
      id: crypto.randomUUID(),
      customerId: customerId ?? null,
      originalFilename: file.originalname,
      storedFilename: storageKey,
      mimeType: file.mimetype,
      extension,
      fileSizeBytes: file.size,
      checksumSHA256,
      uploadStatus: "PROCESSING",
      storageProvider: "local",
      storageKey,
      uploadedAt: new Date(),
    });

    await this.repo.save(upload);

    // Kick off analysis (we can await it here since it's an API, or do it async)
    try {
      const geometry = await this.analysisService.analyze(
        file.buffer,
        extension,
      );

      const analysis = ModelAnalysisEntity.create({
        id: crypto.randomUUID(),
        uploadId: upload.id,
        boundingBoxX: geometry.boundingBoxX,
        boundingBoxY: geometry.boundingBoxY,
        boundingBoxZ: geometry.boundingBoxZ,
        volumeMm3: geometry.volumeMm3,
        surfaceAreaMm2: geometry.surfaceAreaMm2,
        triangleCount: geometry.triangleCount,
        isManifold: geometry.isManifold,
        hasSelfIntersections: geometry.hasSelfIntersections,
        estimatedComplexity: geometry.estimatedComplexity,
        thumbnailPath: null, // Placeholder abstraction
        analysisStatus: "COMPLETED",
        analyzedAt: new Date(),
      });

      await this.repo.saveAnalysis(analysis);

      upload.setStatus("COMPLETED");
      await this.repo.save(upload);
    } catch (error) {
      this.logger.error("Analysis failed", error);
      upload.setStatus("FAILED");
      await this.repo.save(upload);
      // Remove from storage if analysis totally fails? Or keep it? The business logic usually keeps it as FAILED.
    }

    return upload;
  }

  async getUpload(id: string): Promise<UploadEntity | null> {
    return this.repo.findById(id);
  }

  async getAllUploads(): Promise<UploadEntity[]> {
    return this.repo.findAll();
  }

  async deleteUpload(id: string): Promise<void> {
    const upload = await this.repo.findById(id);
    if (!upload) {
      throw new BadRequestException("Upload not found");
    }
    await this.storage.delete(upload.toJSON().storageKey);
    await this.repo.delete(id);
  }

  async getAnalysis(uploadId: string): Promise<ModelAnalysisEntity | null> {
    return this.repo.findAnalysisByUploadId(uploadId);
  }
}
