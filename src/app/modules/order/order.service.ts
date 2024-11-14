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

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(ModelEntity.name) private modelModel: Model<ModelEntity>,
  ) {}

  async createOrder(user_id: string, role: string, body: CreateOrderDto) {
    try {
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
      }

      const totalAmount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      body.total_amount = totalAmount;

      const orderData =
        user_id && role !== 'admin'
          ? { ...body, user_id }
          : { ...body, user_id: 'admin' };
      return await this.orderModel.create(orderData);
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

      const [res, total] = await Promise.all([
        this.orderModel
          .find(query)
          .skip(passedPage)
          .limit(resPerPage)
          .lean()
          .exec(),
        this.orderModel.countDocuments(query),
      ]);
      return { orders: res, total, page: passedPage, limit: resPerPage };
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
      const res = await this.orderModel.findById(id);
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

    return await this.orderModel
      .findByIdAndUpdate(id, entity, {
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
