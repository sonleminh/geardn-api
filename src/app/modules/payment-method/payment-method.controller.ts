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
import { PaymentMethodService } from './payment-method.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/app/decorators/role.decorator';
import { RBAC } from 'src/app/enums/rbac.enum';

@Controller('payment-method')
@UseGuards(JwtAuthGuard)
export class PaymentMethodController {
  constructor(private paymentMethodService: PaymentMethodService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  async createPaymentMethod(
    @Body() createPaymentMethodDTO: CreatePaymentMethodDto,
  ) {
    return await this.paymentMethodService.create(createPaymentMethodDTO);
  }

  @Get()
  async getPaymentMethodList() {
    return this.paymentMethodService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return await this.paymentMethodService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param() { id }: { id: string },
    @Body() body: UpdatePaymentMethodDto,
  ) {
    return await this.paymentMethodService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.paymentMethodService.delete(id);
  }
}
