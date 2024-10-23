import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Cart } from './entities/cart.entity';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { ModelService } from '../model/model.service';

interface CartItemUnpopulated {
  model: string; // The model is just an ObjectId (string)
  quantity: number;
}
interface CartItemPopulated {
  model: {
    _id: string;
    // name: string;
    // price: number;
    // extinfo: {
    //   tier_index: number[];
    // };
    // product: {
    //   _id: string;
    //   name: string;
    // };
  };
  quantity: number;
}

type CartItem = CartItemUnpopulated | CartItemPopulated;

interface ICart {
  _id: string;
  user_id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// interface CartItem {
//   model: {
//     _id: string;
//     name: string;
//     price: number;
//     extinfo: {
//       tier_index: number[];
//     };
//     product: {
//       _id: string;
//       name: string;
//     };
//   };
//   quantity: number;
// }
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(ModelEntity.name) private modelModel: Model<ModelEntity>,
    private readonly modelService: ModelService,
  ) {}

  async upsertCart(user_id: string, model: string, quantity: number) {
    // Step 1: Verify that the product with the given SKU exists
    console.log(model);
    const res = await this.modelService.findById(model);
    if (!res) {
      throw new NotFoundException('Model not found');
    }

    // Step 2: Find the user's cart
    let cart = await this.cartModel.findOne({ user_id: user_id }).exec();

    if (cart) {
      // Step 3: Check if the cart already contains the product
      const itemIndex = cart.items.findIndex((item) => item.model === model);

      if (itemIndex > -1) {
        // If the product exists in the cart, update its quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to the cart
        cart.items.push({
          model: res?._id.toString(),
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

  async reduceQuantity(user_id: string, model_id: string, quantity: number) {
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
            select: 'name price', // Select the fields from the Product schema that you want
          },
          select: 'product_id name price',
        })
        .exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy giỏ hàng!');
      }

      const transformedRes: ICart = {
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
              model: {
                _id: item.model._id,
              },
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
}
