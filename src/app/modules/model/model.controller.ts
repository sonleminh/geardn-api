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
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ModelService } from './model.service';
import { CreateModelDto, UpdateModelDto } from './dto/model.dto';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('model')
export class ModelController {
  constructor(private modelService: ModelService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createModel(@Body() body: CreateModelDto) {
    return await this.modelService.create(body);
  }

  // @Get()
  // async getAllProductSku() {
  //   return this.productSkuService.findAll();
  // }

  @Get('initial-for-create')
  async findInitial() {
    return await this.modelService.initialForCreate();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return this.modelService.findById(id);
  }

  @Get('/product/:id')
  @HttpCode(HttpStatus.OK)
  async findByProductId(@Param() { id }: ObjectIdParamDto) {
    return await this.modelService.findByProductId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async update(@Param() { id }: { id: string }, @Body() body: UpdateModelDto) {
    return await this.modelService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.modelService.remove(id);
  }
}
