import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ILoginResponse } from 'src/app/interfaces/IUser';
import { getCartTokenFromCookies } from 'src/app/utils/getCartToken';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { ModelService } from '../model/model.service';
import { UpdateCartDto } from './dto/cart.dto';
import { Cart } from './entities/cart.entity';

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

  private async findCart(req: Request, user_id: string): Promise<any> {
    const cartToken = getCartTokenFromCookies(req);

    if (user_id) {
      const cart = await this.cartModel.findOne({ user_id }).exec();
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    } else if (cartToken) {
      const cart = await this.cartModel.findById(cartToken);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    }

    throw new NotFoundException('Cart not found');
  }

  async addCart(
    req: Request,
    res: Response,
    user_id: string,
    model: string,
    quantity: number,
  ) {
    // Check if the model exists
    const modelRes = await this.modelService.findById(model);
    if (!modelRes) {
      throw new NotFoundException('Model not found');
    }

    // Get the cart token
    const cartToken = getCartTokenFromCookies(req);

    // Step 1: Verify that the product with the given SKU exists
    if (quantity && modelRes?.stock === 0) {
      throw new ConflictException('This item is out of stock');
    }
    if (quantity > modelRes?.stock) {
      throw new NotFoundException('Quantity added exceeds stock');
    }

    let cart;
    if (user_id) {
      // Find or create cart for user
      cart = await this.cartModel.findOne({ user_id }).exec();
      if (!cart) {
        cart = new this.cartModel({ user_id, items: [] });
        await cart.save();
      }
    } else if (cartToken) {
      // Find cart by cartToken if no user_id
      cart = await this.cartModel.findById(cartToken);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
    } else {
      const cart = await this.cartModel.create({
        items: [
          {
            model,
            quantity,
          },
        ],
      });
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      res.cookie('cart_token', cart._id.toString(), {
        expires: expires,
        path: '/',
      });
      return cart;
    }

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
    return cart.save();
  }

  async subtractQuantity(
    req: Request,
    user_id: string,
    model: string,
    quantity: number,
  ) {
    const modelRes = await this.modelService.findById(model);
    if (!modelRes) {
      throw new NotFoundException('Model not found');
    }

    const cart = await this.findCart(req, user_id);
    const itemIndex = await cart.items.findIndex(
      (item) => item.model === model,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity -= quantity;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
    return cart.save();
  }

  async getCartById(req: Request) {
    try {
      const cookies = req.headers?.cookie;
      const at = cookies
        ?.split('; ')
        .find((cookie) => cookie.startsWith('at='))
        ?.split('=')[1];
      const cartToken = getCartTokenFromCookies(req);

      if (!at && !cartToken) {
        throw new NotFoundException('Không tìm thấy giỏ hàng!');
      }

      let userData: ILoginResponse | null = null;
      if (at) {
        userData = jwt.verify(at, 'geardn') as ILoginResponse;
        if (!userData) {
          throw new NotFoundException('Không tìm thấy giỏ hàng!');
        }
      }

      const cartId = at ? { user_id: userData?._id } : { _id: cartToken };
      const cart = await this.findAndTransformCart(cartId);

      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng!');
      }

      return cart;
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

  private async findAndTransformCart(query: object) {
    const res = await this.cartModel
      .findOne(query)
      .populate({
        path: 'items.model',
        model: ModelEntity.name,
        populate: {
          path: 'product', // Populating the product_id from the Model schema
          model: 'Product',
          select: 'name price tier_variations images',
        },
        select: 'product_id name price extinfo',
      })
      .exec();

    if (!res) {
      return null;
    }

    return {
      _id: res._id.toString(),
      user_id: res.user_id,
      items: res.items.map(this.transformCartItem),
    };
  }

  private transformCartItem(item: CartItem) {
    if (typeof item.model === 'string') {
      return {
        model: item.model,
        quantity: item.quantity,
      };
    } else {
      const model = item.model;
      const product = model?.product;
      const tierImages =
        product?.tier_variations?.length && model?.extinfo
          ? product?.tier_variations[0]?.images[model?.extinfo?.tier_index[0]]
          : product?.images[0];

      return {
        model_id: model._id,
        name: model.name || '',
        price: model.price,
        image: tierImages,
        extinfo: model.extinfo,
        product_id: product?._id,
        product_name: product?.name,
        quantity: item.quantity,
      };
    }
  }
}
