export interface OrderData {
  id: string;
  status: string;
  itemCount: number;
  createdAt: string;
  totalAmount: number;
}

export interface QuoteData {
  id: string;
  state: string;
  createdAt: string;
  uploadId: string;
  uploadSnapshot?: {
    originalFilename: string;
  };
  materialSnapshot?: {
    id: string;
    name: string;
    color: string;
  };
  printerSnapshot?: {
    name: string;
    layerHeightMm: number;
  };
  analysisSnapshot?: {
    volumeMm3: number;
    estimatedPrintTimeSeconds: number;
  };
  pricing?: {
    materialCost: number;
    machineCost: number;
    electricityCost: number;
    wearCost: number;
    failureMargin: number;
    packagingCost: number;
    profitMargin: number;
  };
}

export interface AnalysisData {
  isPrintable: boolean;
  dimensionsX: number;
  dimensionsY: number;
  dimensionsZ: number;
  volumeMm3: number;
  surfaceAreaMm2: number;
  triangleCount: number;
  isManifold: boolean;
}

export interface MaterialData {
  id: string;
  name: string;
  type: string;
  color: string;
  hexColor?: string;
  family?: string;
  description?: string;
  costPerGram: number;
  densityGcm3: number;
  isActive: boolean;
}

export interface PrinterProfileData {
  id: string;
  name: string;
  description?: string;
  layerHeightMm: number;
  nozzleSizeMm: number;
  printSpeedMmS: number;
  infillPercentage: number;
  hourlyRate: number;
}
