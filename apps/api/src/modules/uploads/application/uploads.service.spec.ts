import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { UploadsService } from "./uploads.service";
import { AnalysisService } from "./analysis.service";
import { UploadEntity } from "../domain/upload.entity";

describe("UploadsService", () => {
  let service: UploadsService;

  const mockRepo = {
    findByChecksum: vi.fn(),
    save: vi.fn(),
    saveAnalysis: vi.fn(),
  };

  const mockStorage = {
    save: vi.fn().mockResolvedValue("mock-storage-key"),
  };

  const mockAnalysisService = {
    analyze: vi.fn().mockResolvedValue({
      boundingBoxX: 10,
      boundingBoxY: 10,
      boundingBoxZ: 10,
      volumeMm3: 1000,
      surfaceAreaMm2: 600,
      triangleCount: 12,
      isManifold: true,
      hasSelfIntersections: false,
      estimatedComplexity: "LOW",
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        { provide: "IUploadRepository", useValue: mockRepo },
        { provide: "IStorageProvider", useValue: mockStorage },
        { provide: AnalysisService, useValue: mockAnalysisService },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("processUpload", () => {
    it("should reject files that are too large", async () => {
      const mockFile = {
        size: 150 * 1024 * 1024,
        originalname: "test.stl",
        mimetype: "model/stl",
        buffer: Buffer.from("test"),
      } as Express.Multer.File;

      await expect(service.processUpload(mockFile)).rejects.toThrow(
        "File is too large",
      );
    });

    it("should reject unsupported extensions", async () => {
      const mockFile = {
        size: 1024,
        originalname: "test.txt",
        mimetype: "text/plain",
        buffer: Buffer.from("test"),
      } as Express.Multer.File;

      await expect(service.processUpload(mockFile)).rejects.toThrow(
        "Unsupported file extension",
      );
    });

    it("should process a valid STL file", async () => {
      const mockFile = {
        size: 1024,
        originalname: "test.stl",
        mimetype: "model/stl",
        buffer: Buffer.from("test stl content"),
      } as Express.Multer.File;

      mockRepo.findByChecksum.mockResolvedValue(null);
      mockRepo.save.mockImplementation(async (entity: unknown) => entity);

      const result = await service.processUpload(mockFile);

      expect(result).toBeDefined();
      expect(result.toJSON().originalFilename).toBe("test.stl");
      expect(result.toJSON().uploadStatus).toBe("COMPLETED");
      expect(mockStorage.save).toHaveBeenCalled();
      expect(mockAnalysisService.analyze).toHaveBeenCalled();
      expect(mockRepo.saveAnalysis).toHaveBeenCalled();
    });

    it("should reject duplicate files based on checksum", async () => {
      const mockFile = {
        size: 1024,
        originalname: "test.stl",
        mimetype: "model/stl",
        buffer: Buffer.from("test"),
      } as Express.Multer.File;

      mockRepo.findByChecksum.mockResolvedValue(
        UploadEntity.create({
          id: "1",
          customerId: null,
          originalFilename: "old.stl",
          storedFilename: "key",
          mimeType: "model/stl",
          extension: ".stl",
          fileSizeBytes: 1024,
          checksumSHA256: "hash",
          uploadStatus: "COMPLETED",
          storageProvider: "local",
          storageKey: "key",
          uploadedAt: new Date(),
        }),
      );

      await expect(service.processUpload(mockFile)).rejects.toThrow(
        "Duplicate file upload detected",
      );
    });
  });
});
