import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Roles } from 'src/app/decorators/role.decorator';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { RBAC } from 'src/app/enums/rbac.enum';
import * as XLSX from 'xlsx';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  CreateProductDto,
  UpdateProductDto,
  UploadProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';
import { QueryParamDto } from 'src/app/dtos/query-params.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createProduct(@Body() body: CreateProductDto) {
    return await this.productService.createProduct(body);
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file?.buffer, { type: 'buffer' });
    const worksheet = workbook?.Sheets[workbook?.SheetNames?.[0]];
    const jsonData: UploadProductDto[] = XLSX.utils.sheet_to_json(worksheet);

    return this.productService.processExcelData(jsonData);
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get('/admin')
  async getProductList(@Query() queryParam: QueryParamDto) {
    return this.productService.findAll(queryParam);
  }

  @Get('initial-to-create')
  async findInitial() {
    return await this.productService.getInitialProductForCreate();
  }

  @Get('/category/:id')
  async getProductByCategory(
    @Param('id') id: Types.ObjectId,
    @Query() queryParam: QueryParamDto,
  ) {
    return await this.productService.getProductByCategory(id, queryParam);
  }

  @Get(':id')
  async getProductById(@Param('id') id: Types.ObjectId) {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async updateProduct(
    @Param() { id }: { id: Types.ObjectId },
    @Body() updateProductDTO: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async softDelete(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deleteCount: number }> {
    return await this.productService.softDelete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.CREATED)
  async softDeleteMany(@Body() ids: any) {
    return this.productService.softDeleteMany(ids);
  }
}
