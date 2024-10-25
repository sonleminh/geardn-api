import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService, ICart } from './cart.service';
import { UpsertCartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
    return this.cartService.upsertCart(_id, body.model, body.quantity);
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
}