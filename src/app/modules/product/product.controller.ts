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

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  @Post('/')
  async createArticle(
    @Body() createProductDTO: CreateProductDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.productService.createProduct(
      createProductDTO,
      thumbnail_image,
    );
  }

  @Get()
  async getArticleList(@Query() queryParam) {
    return this.productService.findAll(queryParam);
  }

  @Get('get-product-initial')
  async findInitial() {
    return await this.productService.getInitialProductForCreate();
  }

  @Get(':id')
  async getArticleById(@Param('id') id: Types.ObjectId) {
    return this.productService.getProductById(id);
  }

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  @Patch(':id')
  async updateArticle(
    @Param() { id }: { id: Types.ObjectId },
    @Body() updateArticleDTO: UpdateProductDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.productService.update(
      id,
      updateArticleDTO,
      thumbnail_image,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async softDelete(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deleteCount: number }> {
    return await this.productService.deleteSoft(id);
  }
}
