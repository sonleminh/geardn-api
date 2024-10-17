import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(
    @AuthUser() { _id },
    @Body() body: { sku_id: string; quantity: number },
  ) {
    return this.cartService.upsertCart(_id, body.sku_id, body.quantity);
  }

  @Post('reduce')
  async reduceQuantity(
    @AuthUser() { _id },
    @Body() body: { sku_id: string; quantity: number },
  ) {
    return this.cartService.reduceQuantity(_id, body.sku_id, body.quantity);
  }
}
