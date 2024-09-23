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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Types } from 'mongoose';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  async createProduct(
    @Body() createProductDTO: CreateProductDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.productService.createProduct(
      createProductDTO,
      thumbnail_image,
    );
  }

  @Get()
  async getProductList(@Query() queryParam) {
    return this.productService.findAll(queryParam);
  }

  @Get('get-product-initial')
  async findInitial() {
    return await this.productService.getInitialProductForCreate();
  }

  @Get(':id')
  async getProductById(@Param('id') id: Types.ObjectId) {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  async updateProduct(
    @Param() { id }: { id: Types.ObjectId },
    @Body() updateProductDTO: UpdateProductDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.productService.update(
      id,
      updateProductDTO,
      thumbnail_image,
    );
  }
}
