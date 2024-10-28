import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Cart, Order } from './entities/order.entity';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { ModelService } from '../model/model.service';
import { UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly modelService: ModelService,
  ) {}

  async createOrder(user_id: string, body: any) {
    try {
      return await this.orderModel.create(body);
    } catch (error) {
      throw error;
    }
  }
}
