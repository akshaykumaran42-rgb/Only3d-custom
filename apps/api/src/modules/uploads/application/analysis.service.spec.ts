import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { AnalysisService } from "./analysis.service";

describe("AnalysisService", () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("analyzeSTL", () => {
    it("should throw error for file smaller than 84 bytes", async () => {
      const buffer = Buffer.alloc(80);
      await expect(service.analyze(buffer, ".stl")).rejects.toThrow(
        "Invalid STL file (too small)",
      );
    });

    it("should parse mock binary STL correctly", async () => {
      // Create a valid binary STL buffer with 1 triangle
      const buffer = Buffer.alloc(84 + 50);
      buffer.writeUInt32LE(1, 80); // 1 triangle
      // Mock triangle vertices (0,0,0), (1,0,0), (0,1,0)
      buffer.writeFloatLE(0, 84 + 12); // v1.x
      buffer.writeFloatLE(0, 84 + 16); // v1.y
      buffer.writeFloatLE(0, 84 + 20); // v1.z

      buffer.writeFloatLE(1, 84 + 24); // v2.x
      buffer.writeFloatLE(0, 84 + 28); // v2.y
      buffer.writeFloatLE(0, 84 + 32); // v2.z

      buffer.writeFloatLE(0, 84 + 36); // v3.x
      buffer.writeFloatLE(1, 84 + 40); // v3.y
      buffer.writeFloatLE(0, 84 + 44); // v3.z

      const result = await service.analyze(buffer, ".stl");

      expect(result.triangleCount).toBe(1);
      expect(result.boundingBoxX).toBe(1);
      expect(result.boundingBoxY).toBe(1);
      expect(result.boundingBoxZ).toBe(0);
      expect(result.surfaceAreaMm2).toBeCloseTo(0.5, 2);
    });
  });

  describe("analyze3MF", () => {
    it("should reject invalid 3MF", async () => {
      const buffer = Buffer.alloc(10);
      await expect(service.analyze(buffer, ".3mf")).rejects.toThrow();
    });
  });
});
