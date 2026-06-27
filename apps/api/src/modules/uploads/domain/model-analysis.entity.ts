export interface ModelAnalysisProps {
  id: string;
  uploadId: string;
  boundingBoxX: number;
  boundingBoxY: number;
  boundingBoxZ: number;
  volumeMm3: number;
  surfaceAreaMm2: number;
  triangleCount: number;
  isManifold: boolean;
  hasSelfIntersections: boolean;
  estimatedComplexity: string;
  thumbnailPath: string | null;
  analysisStatus: string;
  analyzedAt: Date;
}

export class ModelAnalysisEntity {
  private constructor(private readonly props: ModelAnalysisProps) {}

  get id() {
    return this.props.id;
  }
  get uploadId() {
    return this.props.uploadId;
  }

  static create(props: ModelAnalysisProps): ModelAnalysisEntity {
    return new ModelAnalysisEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
