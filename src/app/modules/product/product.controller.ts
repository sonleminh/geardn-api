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
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  async createProduct(
    @Body() createProductDTO: any,
    // @Body() createProductDTO: CreateProductDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    console.log(thumbnail_image)
    // return await this.productService.createProduct(
    //   createProductDTO,
    //   thumbnail_image,
    // );
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async softDelete(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deleteCount: number }> {
    return await this.productService.deleteSoft(id);
  }
}
