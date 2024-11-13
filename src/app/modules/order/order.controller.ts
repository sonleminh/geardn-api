import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { Types } from 'mongoose';
import { StatusUpdateDto } from './dto/order.dto';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  async createOrder(@AuthUser() { _id, role }, @Body() body: any) {
    return this.orderService.createOrder(_id, role, body);
  }

  @Get()
  async getOrderList(@Query() queryParam) {
    return this.orderService.findAll(queryParam);
  }

  @Get()
  async getOrdersByUser(@AuthUser() { _id }) {
    return this.orderService.getOrdersByUser(_id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: Types.ObjectId) {
    return this.orderService.getOrderById(id);
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