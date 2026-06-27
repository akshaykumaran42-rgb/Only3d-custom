import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IUploadRepository } from "../domain/upload.repository.interface";
import { UploadEntity } from "../domain/upload.entity";
import { ModelAnalysisEntity } from "../domain/model-analysis.entity";
import { Upload, ModelAnalysis, UploadStatus } from "@only3d/database";

@Injectable()
export class PrismaUploadRepository implements IUploadRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapUploadToDomain(model: Upload): UploadEntity {
    return UploadEntity.create({
      id: model.id,
      customerId: model.customerId,
      originalFilename: model.originalFilename,
      storedFilename: model.storedFilename,
      mimeType: model.mimeType,
      extension: model.extension,
      fileSizeBytes: model.fileSizeBytes,
      checksumSHA256: model.checksumSHA256,
      uploadStatus: model.uploadStatus as unknown as
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED",
      storageProvider: model.storageProvider,
      storageKey: model.storageKey,
      uploadedAt: model.uploadedAt,
    });
  }

  private mapAnalysisToDomain(model: ModelAnalysis): ModelAnalysisEntity {
    return ModelAnalysisEntity.create({
      id: model.id,
      uploadId: model.uploadId,
      boundingBoxX: model.boundingBoxX,
      boundingBoxY: model.boundingBoxY,
      boundingBoxZ: model.boundingBoxZ,
      volumeMm3: model.volumeMm3,
      surfaceAreaMm2: model.surfaceAreaMm2,
      triangleCount: model.triangleCount,
      isManifold: model.isManifold,
      hasSelfIntersections: model.hasSelfIntersections,
      estimatedComplexity: model.estimatedComplexity,
      thumbnailPath: model.thumbnailPath,
      analysisStatus: model.analysisStatus,
      analyzedAt: model.analyzedAt,
    });
  }

  async findById(id: string): Promise<UploadEntity | null> {
    const data = await this.prisma.upload.findUnique({ where: { id } });
    return data ? this.mapUploadToDomain(data) : null;
  }

  async findByChecksum(checksumSHA256: string): Promise<UploadEntity | null> {
    const data = await this.prisma.upload.findUnique({
      where: { checksumSHA256 },
    });
    return data ? this.mapUploadToDomain(data) : null;
  }

  async findAll(): Promise<UploadEntity[]> {
    const data = await this.prisma.upload.findMany();
    return data.map((d) => this.mapUploadToDomain(d));
  }

  async save(entity: UploadEntity): Promise<UploadEntity> {
    const data = entity.toJSON();
    const prismaData = {
      ...data,
      uploadStatus: data.uploadStatus as UploadStatus,
    };

    const existing = await this.prisma.upload.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.upload.update({
        where: { id: data.id },
        data: prismaData,
      });
    } else {
      await this.prisma.upload.create({ data: prismaData });
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.upload.delete({ where: { id } });
  }

  async saveAnalysis(
    entity: ModelAnalysisEntity,
  ): Promise<ModelAnalysisEntity> {
    const data = entity.toJSON();
    const existing = await this.prisma.modelAnalysis.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.modelAnalysis.update({ where: { id: data.id }, data });
    } else {
      await this.prisma.modelAnalysis.create({ data });
    }
    return entity;
  }

  async findAnalysisByUploadId(
    uploadId: string,
  ): Promise<ModelAnalysisEntity | null> {
    const data = await this.prisma.modelAnalysis.findUnique({
      where: { uploadId },
    });
    return data ? this.mapAnalysisToDomain(data) : null;
  }
}
