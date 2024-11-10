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

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(user_id: string, role: string, body: any) {
    try {
      console.log(user_id, role);
      const orderData =
        user_id && role !== 'admin'
          ? { ...body, user_id }
          : { ...body, user_id: 'admin' };
      console.log(orderData);
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
      console.log(id);
      const res = await this.orderModel.findById(id);
      if (!res) {
        throw new NotFoundException('Không tìm thấy đơn hàng!');
      }

      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy đơn hàng!');
    }
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(RBAC.ADMIN)
  // async updateProduct(
  //   @Param() { id }: { id: Types.ObjectId },
  //   @Body() updateProductDTO: UpdateProductDto,
  // ) {
  //   return await this.productService.update(id, updateProductDTO);
  // }
}
