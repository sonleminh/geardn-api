import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ModelService } from '../model/model.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(user_id: string, body: any) {
    try {
      console.log({ ...body, user_id: user_id });
      return await this.orderModel.create({ ...body, user_id: user_id });
    } catch (error) {
      throw error;
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

      return { ordersList: res, total };
    } catch {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }
  }
}
