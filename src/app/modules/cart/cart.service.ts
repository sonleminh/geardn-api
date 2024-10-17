import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ProductSku } from '../product-sku/entities/product-sku.entity';
import { ProductSkuService } from '../product-sku/product-sku.service';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(ProductSku.name) private productSkuModel: Model<ProductSku>,
    private readonly productSkuService: ProductSkuService,
  ) {}

  async upsertCart(user_id: string, sku_id: string, quantity: number) {
    // Step 1: Verify that the product with the given SKU exists
    const sku = await this.productSkuService.findById(sku_id);
    if (!sku) {
      throw new NotFoundException('SKU not found');
    }

    // Step 2: Find the user's cart
    let cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    if (cart) {
      // Step 3: Check if the cart already contains the product
      const itemIndex = cart.items.findIndex((item) => item.sku_id === sku_id);

      if (itemIndex > -1) {
        // If the product exists in the cart, update its quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({
          sku_id: sku._id.toString(),
          quantity,
        });
      }
    } else {
      // If no cart exists for the user, create a new cart
      cart = new this.cartModel({
        user_id: user_id,
        items: [
          {
            sku_id: sku._id,
            quantity,
          },
        ],
      });
    }

    // Save the updated or new cart
    return cart.save();
  }

  async reduceQuantity(user_id: string, sku_id: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.sku_id === sku_id);
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity -= quantity;

    // Step 4: Remove the item if its quantity reaches zero
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    // Step 5: Save the updated cart
    return cart.save();
  }
}
