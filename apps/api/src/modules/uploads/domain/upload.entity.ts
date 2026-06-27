export type UploadStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface UploadProps {
  id: string;
  customerId: string | null;
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  extension: string;
  fileSizeBytes: number;
  checksumSHA256: string;
  uploadStatus: UploadStatus;
  storageProvider: string;
  storageKey: string;
  uploadedAt: Date;
}

export class UploadEntity {
  private constructor(private readonly props: UploadProps) {}

  get id() {
    return this.props.id;
  }
  get checksumSHA256() {
    return this.props.checksumSHA256;
  }
  get uploadStatus() {
    return this.props.uploadStatus;
  }

  setStatus(status: UploadStatus) {
    this.props.uploadStatus = status;
  }

  static create(props: UploadProps): UploadEntity {
    return new UploadEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
