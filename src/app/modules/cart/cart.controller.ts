import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService, ICart } from './cart.service';
import { UpsertCartDto } from './dto/cart.dto';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
    return this.cartService.addCart(_id, body.model, body.quantity);
  }

  @Post('subtract')
  async subtractQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
    return this.cartService.subtractQuantity(_id, body.model, body.quantity);
  }

  @Get()

  async getCartById(@AuthUser() { _id }) {
    return this.cartService.getCartById(_id);
  }

  @Patch()
  async updateCartQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
    return this.cartService.updateCartQuantity(_id, body);
  }

  @Delete(':id')
  async deleteItem(@AuthUser() { _id }, @Param() { id }: ObjectIdParamDto) {
    return this.cartService.deleteItem(_id, id);
  }
}