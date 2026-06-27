import { UploadEntity } from "./upload.entity";
import { ModelAnalysisEntity } from "./model-analysis.entity";

export interface IUploadRepository {
  findById(id: string): Promise<UploadEntity | null>;
  findByChecksum(checksum: string): Promise<UploadEntity | null>;
  findAll(): Promise<UploadEntity[]>;
  save(entity: UploadEntity): Promise<UploadEntity>;
  delete(id: string): Promise<void>;

  saveAnalysis(entity: ModelAnalysisEntity): Promise<ModelAnalysisEntity>;
  findAnalysisByUploadId(uploadId: string): Promise<ModelAnalysisEntity | null>;
}
