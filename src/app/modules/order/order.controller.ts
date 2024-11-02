import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  async createOrder(@AuthUser() { _id }, @Body() body: any) {
    return this.orderService.createOrder(_id, body);
  }

  @Get()
  async getOrderList(@Query() queryParam) {
    return this.orderService.findAll(queryParam);
  }

  @Get()
  async getOrdersByUser(@AuthUser() { _id }) {
    return this.orderService.getOrdersByUser(_id);
  }

  // @Post('subtract')
  // async subtractQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
  //   return this.cartService.subtractQuantity(_id, body.model, body.quantity);
  // }

  // @Get()

  // async getCartById(@AuthUser() { _id }) {
  //   return this.cartService.getCartById(_id);
  // }

  // @Patch()
  // async updateCartQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
  //   return this.cartService.updateCartQuantity(_id, body);
  // }

  // @Delete(':id')
  // async deleteItem(@AuthUser() { _id }, @Param() { id }: ObjectIdParamDto) {
  //   return this.cartService.deleteItem(_id, id);
  // }
}