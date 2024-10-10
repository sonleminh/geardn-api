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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';
import { ProductSkuService } from './product-sku.service';
import { CreateProductSkuDto } from './dto/product-sku.dto';

@Controller('product-sku')
@UseGuards(JwtAuthGuard)
export class ProductSkuController {
  constructor(private productSkuService: ProductSkuService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createProductSku(@Body() body: any) {
    return await this.productSkuService.create(body);
  }

  @Get()
  async getAllProductSku() {
    return this.productSkuService.findAll();
  }

  @Get('initial-for-create')
  async findInitial() {
    return await this.productSkuService.initialForCreate();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return await this.productSkuService.findById(id);
  }

  @Get('/product/:id')
  @HttpCode(HttpStatus.OK)
  async findByProductId(@Param() { id }: ObjectIdParamDto) {
    console.log(id)

    return await this.productSkuService.findByProductId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async update(@Param() { id }: { id: string }, @Body() body: any) {
    return await this.productSkuService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.productSkuService.remove(id);
  }
}
