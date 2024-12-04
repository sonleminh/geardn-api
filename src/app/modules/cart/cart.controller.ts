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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { UpsertCartDto } from './dto/cart.dto';
import { GetUser } from 'src/app/decorators/get-user.decorator';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  // async addToCart(@Body() body: UpsertCartDto) {
  async addToCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
    @GetUser() user: { _id: string } | null,
    @Body() body: UpsertCartDto,
  ) {
    console.log('user?._id:', user?._id)
    // return this.cartService.addCart(
    //   req,
    //   res,
    //   user?._id,
    //   body.model,
    //   body.quantity,
    // );
  }

  @Post('subtract')
  // async subtractQuantity(@AuthUser() { _id }, @Body() body: UpsertCartDto) {
  async subtractQuantity(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
    @GetUser() user: { _id: string } | null,
    @Body() body: UpsertCartDto,
  ) {
    // return this.cartService.subtractQuantity(_id, body.model, body.quantity);
  }

  @Get()
  async getCartById(
    @Req() req: Request,
    @GetUser() user: { _id: string } | null,
  ) {
    return this.cartService.getCartById(req, user?._id);
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
