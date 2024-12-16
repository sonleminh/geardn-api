import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/app/decorators/auth.decorator';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { CartService } from './cart.service';
import { UpsertCartDto } from './dto/cart.dto';
import { GetUser } from 'src/app/decorators/get-user.decorator';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
    @Body() body: UpsertCartDto,
  ) {
    return this.cartService.addCart(
      req,
      res,
      body?.user_id,
      body.model,
      body.quantity,
    );
  }

  @Post('subtract')
  // async subtractQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
  async subtractQuantity(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
    @GetUser() user: { _id: string } | null,
    @Body() body: UpsertCartDto,
  ) {
    return this.cartService.subtractQuantity(
      req,
      body.user_id,
      body.model,
      body.quantity,
    );
  }

  @Get()
  async getCartById(@Req() req: Request) {
    return this.cartService.getCartById(req);
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
