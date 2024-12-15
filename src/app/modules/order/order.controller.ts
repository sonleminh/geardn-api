import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { Types } from 'mongoose';
import { CreateOrderDto, StatusUpdateDto } from './dto/order.dto';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { Roles } from 'src/app/decorators/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { RBAC } from 'src/app/enums/rbac.enum';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  async createOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
    return this.orderService.createOrder(req, body);
  }

  @Get()
  async getOrderList(@Query() queryParam) {
    return this.orderService.findAll(queryParam);
  }

  @Get()
  async getOrdersByUser(@AuthUser() { _id }) {
    console.log('user_id:', _id);
    return this.orderService.getOrdersByUser(_id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: Types.ObjectId) {
    return this.orderService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RBAC.ADMIN)
  @Get('admin/:id')
  async getOrderByIdAdmin(@Param('id') id: Types.ObjectId) {
    return this.orderService.getOrderByIdAdmin(id);
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: Types.ObjectId, @Body() body: any) {
    return this.orderService.updateOrder(id, body);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: Types.ObjectId,
    @Body() statusUpdateDto: StatusUpdateDto
  ) {
    return this.orderService.updateOrderStatus(id, statusUpdateDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async delete(@Param() { id }: ObjectIdParamDto) {
    return await this.orderService.delete(id);
  }
}