import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { UploadsService } from "../application/uploads.service";

@ApiTags("Uploads")
@Controller("uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post()
  @ApiOperation({ summary: "Upload a 3D model (STL/3MF)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    const upload = await this.service.processUpload(file);
    return upload.toJSON();
  }

  @Get()
  @ApiOperation({ summary: "List all uploads" })
  async getAllUploads() {
    const uploads = await this.service.getAllUploads();
    return uploads.map((u) => u.toJSON());
  }

  @Get(":id")
  @ApiOperation({ summary: "Get upload by ID" })
  async getUpload(@Param("id") id: string) {
    const upload = await this.service.getUpload(id);
    if (!upload) throw new BadRequestException("Upload not found");
    return upload.toJSON();
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete upload by ID" })
  async deleteUpload(@Param("id") id: string) {
    await this.service.deleteUpload(id);
    return { success: true };
  }

  @Get(":id/analysis")
  @ApiOperation({ summary: "Get analysis for upload" })
  async getAnalysis(@Param("id") id: string) {
    const analysis = await this.service.getAnalysis(id);
    if (!analysis) throw new BadRequestException("Analysis not found");
    return analysis.toJSON();
  }
}
