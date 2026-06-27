import { IBaseRepository } from "../../../core/repositories/base.repository.interface";
import { MaterialEntity } from "./material.entity";

export interface IMaterialRepository extends IBaseRepository<MaterialEntity> {
  findByInternalCode(internalCode: string): Promise<MaterialEntity | null>;
  findByName(name: string): Promise<MaterialEntity | null>;
  searchAndFilter(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    materialType?: string;
    includeDeleted?: boolean;
  }): Promise<{ data: MaterialEntity[]; total: number }>;
}
