import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Cart } from './entities/cart.entity';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { ModelService } from '../model/model.service';
import { UpdateCartDto } from './dto/cart.dto';

interface CartItemUnpopulated {
  model: string; // The model is just an ObjectId (string)
  quantity: number;
}
interface CartItemPopulated {
  model: {
    _id: string;
    name: string;
    price: number;
    extinfo: {
      tier_index: number[];
      is_pre_order: boolean;
    };
    product: {
      _id: string;
      name: string;
      tier_variations: { name: string; options: string[]; images: string[] }[];
      images: string[];
    };
  };
  quantity: number;
}

type CartItem = CartItemUnpopulated | CartItemPopulated;

export interface ICart {
  _id: string;
  user_id: string;
  items: CartItem[];
}
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(ModelEntity.name) private modelModel: Model<ModelEntity>,
    private readonly modelService: ModelService,
  ) {}

  async addCart(user_id: string, model: string, quantity: number) {
    // Step 1: Verify that the product with the given SKU exists
    const modelRes = await this.modelService.findById(model);
    if (!modelRes) {
      throw new NotFoundException('Model not found');
    }

    if (quantity && modelRes?.stock === 0) {
      throw new ConflictException('This item is out of stock');
    }

    // Step 2: Find the user's cart
    let cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    const modelInCart = cart?.items.find((item) => item.model === model);

    if (modelInCart?.quantity + quantity > modelRes?.stock) {
      throw new ConflictException('Quantity added exceeds stock');
    }

    if (cart) {
      // Step 3: Check if the cart already contains the product
      const itemIndex = cart.items.findIndex((item) => item.model === model);

      if (itemIndex > -1) {
        // If the product exists in the cart, update its quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({
          model: modelRes?._id.toString(),
          quantity,
        });
      }
    } else {
      // If no cart exists for the user, create a new cart
      cart = new this.cartModel({
        user_id: user_id,
        items: [
          {
            model,
            quantity,
          },
        ],
      });
    }

    // Save the updated or new cart
    return cart.save();
  }

  async subtractQuantity(user_id: string, model_id: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.model === model_id);
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

  async getCartById(user_id: string) {
    try {
      const res = await this.cartModel
        .findOne({ user_id: user_id })
        .populate({
          path: 'items.model',
          model: ModelEntity.name,
          populate: {
            path: 'product', // This will populate the product_id from the Model schema
            model: 'Product', // Assuming the model name is 'Product'
            select: 'name price tier_variations images', // Select the fields from the Product schema that you want
          },
          select: 'product_id name price extinfo',
        })
        .exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy giỏ hàng!');
      }

      const transformedRes = {
        _id: res._id.toString(),
        user_id: res.user_id,
        items: res.items.map((item: CartItem) => {
          if (typeof item.model === 'string') {
            // If model is still a string, meaning it's not populated
            return {
              model: item.model,
              quantity: item.quantity,
            };
          } else {
            return {
              // model: {
              //   _id: item.model._id,
              //   name: item.model.name ? item.model.name : '',
              //   price: item.model.price,
              //   image:
              //     item?.model?.product?.tier_variations?.length &&
              //     item?.model?.extinfo
              //       ? item?.model?.product?.tier_variations[0]?.images[
              //           item?.model?.extinfo?.tier_index[0]
              //         ]
              //       : item?.model?.product?.images[0],
              //   extinfo: item.model.extinfo,
              //   product_id: item.model.product._id,
              //   product_name: item.model.product.name,
              // },
              model_id: item.model._id,
              name: item.model.name ? item.model.name : '',
              price: item.model.price,
              image:
                item?.model?.product?.tier_variations?.length &&
                item?.model?.extinfo
                  ? item?.model?.product?.tier_variations[0]?.images[
                      item?.model?.extinfo?.tier_index[0]
                    ]
                  : item?.model?.product?.images[0],
              extinfo: item.model.extinfo,
              product_id: item.model.product._id,
              product_name: item.model.product.name,
              quantity: item.quantity,
            };
          }
        }),
      };

      return transformedRes;
      // return res;
    } catch {
      throw new NotFoundException('Không tìm thấy giỏ hàng!');
    }
  }

  async updateCartQuantity(user_id: string, body: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ user_id: user_id }).exec();
    const model = await this.modelService.findById(body.model);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.model === body?.model,
    );
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }
    
    if (cart.items[itemIndex]?.quantity + body.quantity > model?.stock) {
      throw new ConflictException('Quantity added exceeds stock');
    }

    cart.items[itemIndex].quantity = body.quantity;

    return cart.save();
  }

  async deleteItem(user_id: string, item_id: string) {
    const cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.model === item_id);

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);

    return cart.save();
  }
}
