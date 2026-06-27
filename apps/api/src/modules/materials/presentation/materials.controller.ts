import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MaterialsService } from "../application/materials.service";
import { CreateMaterialDto } from "../application/dtos/create-material.dto";
import { UpdateMaterialDto } from "../application/dtos/update-material.dto";
import { MaterialQueryDto } from "../application/dtos/material-query.dto";

@ApiTags("Materials")
@Controller("materials")
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new material" })
  @ApiResponse({ status: 201, description: "Material created successfully." })
  @ApiResponse({
    status: 409,
    description: "Material with name or code already exists.",
  })
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    const material = await this.materialsService.create(createMaterialDto);
    return material.toJSON();
  }

  @Get()
  @ApiOperation({ summary: "List and search materials" })
  @ApiResponse({ status: 200, description: "List of materials returned." })
  async findAll(@Query() query: MaterialQueryDto) {
    const result = await this.materialsService.findAll(query);
    return {
      data: result.data.map((m) => m.toJSON()),
      meta: {
        total: result.total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a material by ID" })
  @ApiResponse({ status: 200, description: "Material found." })
  @ApiResponse({ status: 404, description: "Material not found." })
  async findOne(@Param("id") id: string) {
    const material = await this.materialsService.findOne(id);
    return material.toJSON();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a material" })
  @ApiResponse({ status: 200, description: "Material updated successfully." })
  @ApiResponse({ status: 404, description: "Material not found." })
  @ApiResponse({ status: 409, description: "Conflict on unique constraints." })
  async update(
    @Param("id") id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    const material = await this.materialsService.update(id, updateMaterialDto);
    return material.toJSON();
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Soft delete a material" })
  @ApiResponse({ status: 204, description: "Material soft deleted." })
  @ApiResponse({ status: 404, description: "Material not found." })
  async remove(@Param("id") id: string) {
    await this.materialsService.remove(id);
  }

  @Post(":id/restore")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Restore a soft-deleted material" })
  @ApiResponse({ status: 200, description: "Material restored." })
  @ApiResponse({ status: 404, description: "Material not found." })
  async restore(@Param("id") id: string) {
    const material = await this.materialsService.restore(id);
    return material.toJSON();
  }
}
