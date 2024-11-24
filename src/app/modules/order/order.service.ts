import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { paginateCalculator } from 'src/app/utils/page-helpers';
import { CreateOrderDto, ORDER_STATUS, UpdateOrderDto } from './dto/order.dto';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entities/cart.entity';
import { obfuscateEmail } from 'src/app/utils/obfuscateEmail';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(ModelEntity.name) private modelModel: Model<ModelEntity>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(body: CreateOrderDto) {
    // async createOrder(user_id: string, role: string, body: CreateOrderDto) {
    try {
      const cart = await this.cartModel.findOne({ user_id: body.user }).exec();
      const orderItems = body.items;
      for (const item of orderItems) {
        const model = await this.modelModel.findById(item.model_id);

        if (!model) {
          throw new BadRequestException(
            `Model with ID ${item.model_id} not found`,
          );
        }

        if (model.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for model ${model.sku}`,
          );
        }

        if (item.quantity === 0) {
          throw new BadRequestException(`Quantity must be greater than 0`);
        }
      }

      for (const item of orderItems) {
        await this.modelModel.findByIdAndUpdate(item.model_id, {
          $inc: { stock: -item.quantity },
        });
        if (cart) {
          const existedItem = cart.items.find(
            (cartItem) => cartItem.model === item.model_id,
          );
          if (existedItem) {
            await this.cartService.deleteItem(body.user, item.model_id);
          }
        }
      }

      const totalAmount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      const order = { ...body, total_amount: totalAmount };

      // const orderData =
      //   user_id && role !== 'admin'
      //     ? { ...body, user_id }
      //     : { ...body, user_id: 'admin' };
      return await this.orderModel.create(order);
    } catch (error) {
      throw error;
    }
  }

  async findAll({ s, status, page, limit }) {
    try {
      const query = {};
      const { resPerPage, passedPage } = paginateCalculator(page, limit);

      if (status) {
        query['status'] = status;
      }

      if (s) {
        query['$or'] = [
          { name: { $regex: s, $options: 'i' } },
          { phone: { $regex: s, $options: 'i' } },
          { 'address.city': { $regex: s, $options: 'i' } },
          { 'address.street': { $regex: s, $options: 'i' } },
        ];
      }

      const [res, total, statusCounts] = await Promise.all([
        this.orderModel
          .find(query)
          .skip(passedPage)
          .limit(resPerPage)
          .lean()
          .exec(),
        this.orderModel.countDocuments(),
        this.orderModel.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
        ]),
      ]);

      return {
        orders: res,
        total,
        status_counts: statusCounts.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        page: passedPage,
        limit: resPerPage,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOrdersByUser(user_id: string) {
    try {
      const [res, total] = await Promise.all([
        this.orderModel.find({ user_id: user_id }).lean().exec(),
        this.orderModel.countDocuments({ user_id: user_id }),
      ]);
      if (!res) {
        throw new NotFoundException('Không tìm thấy đơn hàng!');
      }

      return { orders: res, total };
    } catch {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }
  }

  async getOrderById(id: Types.ObjectId) {
    try {
      const res = await this.orderModel.findById(id)?.lean().exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy đơn hàng!');
      }

      if (res.shipment?.address) {
        const addressParts = res.shipment.address.split(', ');
        // Replace the first part of the address with "xxx" if there are parts available
        if (addressParts.length > 0) {
          addressParts[0] = 'xxx';
        }
        // Join the parts back together
        res.shipment.address = addressParts.join(', ');
      }
      const newRes = {
        ...res,
        customer: {
          ...res.customer,
          phone: res.customer.phone.slice(0, -3) + 'xxx',
          mail: obfuscateEmail(res.customer.mail),
        },
        shipment: {
          ...res.shipment,
          receive_name: res.customer.name,
          receive_phone: res.customer.phone.slice(0, -3) + 'xxx',
        },
      };
      return newRes;
    } catch {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }
  }

  async getOrderByIdAdmin(id: Types.ObjectId) {
    try {
      const res = await this.orderModel.findById(id)?.lean().exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy đơn hàng!');
      }

      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }
  }

  async updateOrder(id: Types.ObjectId, body: UpdateOrderDto) {
    const entity = await this.orderModel
      .findById(id)
      .where({ is_deleted: { $ne: true } })
      .lean();

    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const updatedItems = body.items;
    const originalItems = entity.items;

    const removedItems = originalItems.filter(
      (originalItem) =>
        !updatedItems.some(
          (updatedItem) =>
            updatedItem.model_id.toString() ===
            originalItem.model_id.toString(),
        ),
    );
    if (removedItems?.length) {
      for (const removedItem of removedItems) {
        await this.modelModel.findByIdAndUpdate(removedItem.model_id, {
          $inc: { stock: +removedItem?.quantity },
        });
      }
    }

    // Step 1: Calculate stock adjustments for each item
    for (const updatedItem of updatedItems) {
      const originalItem = originalItems.find(
        (item) => item.model_id.toString() === updatedItem.model_id.toString(),
      );

      const model = await this.modelModel.findById(updatedItem.model_id);
      if (!model) {
        throw new NotFoundException(
          `Model with ID ${updatedItem.model_id} not found`,
        );
      }

      const originalQuantity = originalItem ? originalItem.quantity : 0;
      const quantityChange = updatedItem.quantity - originalQuantity;

      // Step 2: Validate stock change
      if (quantityChange > 0 && model.stock < quantityChange) {
        throw new BadRequestException(
          `Insufficient stock for model ${model.name}`,
        );
      }

      if (updatedItem.quantity === 0) {
        throw new BadRequestException(`Quantity must be greater than 0`);
      }

      // Step 3: Apply stock adjustment
      await this.modelModel.findByIdAndUpdate(updatedItem.model_id, {
        $inc: { stock: -quantityChange },
      });
    }

    const totalAmount = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    entity.items = updatedItems.map((item) => ({
      ...item,
      model_id: new Types.ObjectId(item.model_id),
      product_id: new Types.ObjectId(item.model_id),
    }));
    entity.total_amount = totalAmount;

    const newData = {
      ...entity,
      ...body,
    };

    return await this.orderModel
      .findByIdAndUpdate(id, newData, {
        new: true,
      })
      .exec();
  }

  async updateOrderStatus(id: Types.ObjectId, status: ORDER_STATUS) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return order.save();
  }

  async delete(id: string) {
    try {
      const entity = await this.orderModel.findById(id).lean();
      if (!entity) {
        throw new NotFoundException('Đối tượng không tồn tại!!');
      }

      const orderItems = entity?.items;

      for (const item of orderItems) {
        await this.modelModel.findByIdAndUpdate(item.model_id, {
          $inc: { stock: +item.quantity },
        });
      }
      const result = await this.orderModel.deleteOne({ _id: id }).exec();
      return {
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw error;
    }
  }
}
