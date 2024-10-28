import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ModelService } from '../model/model.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(user_id: string, body: any) {
    try {
      return await this.orderModel.create(body);
    } catch (error) {
      throw error;
    }
  }
}
