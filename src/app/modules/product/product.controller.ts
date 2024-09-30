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
  UseGuards
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/app/decorators/role.decorator';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { RBAC } from 'src/app/enums/rbac.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UpdateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createProduct(@Body() body: any) {
    return await this.productService.createProduct(body);
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
    return await this.productService.deleteSoft(id);
  }
}
