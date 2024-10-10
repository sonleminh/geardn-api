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
import { CreateAttributeDto, UpdateAttributeDto } from './dto/attribute.dto';
import { AttributeService } from './attribute.service';

@Controller('attribute')
@UseGuards(JwtAuthGuard)
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createAttribute(@Body() body: CreateAttributeDto) {
    return await this.attributeService.create(body);
  }

  @Get()
  async getAllAttribute() {
    return this.attributeService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return await this.attributeService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param() { id }: { id: string },
    @Body() body: UpdateAttributeDto,
  ) {
    return await this.attributeService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.attributeService.remove(id);
  }
}
