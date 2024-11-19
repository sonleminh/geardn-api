import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
  ) {}
  async create(body: CreatePaymentMethodDto) {
    try {
      return await this.paymentMethodModel.create(body);
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      const res = await this.paymentMethodModel.find().lean().exec();
      return { status: HttpStatus.OK, message: 'success', data: res };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: string) {
    try {
      const res = await this.paymentMethodModel.findById(id);
      if (!res) {
        throw new NotFoundException('Không tìm thấy danh mục!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy danh mục!');
    }
  }
  async update(
    id: string,
    body: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const entity = await this.paymentMethodModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }
    return await this.paymentMethodModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }
  async delete(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.paymentMethodModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }
    const result = await this.paymentMethodModel.deleteOne({ _id: id }).exec();
    return {
      deletedCount: result.deletedCount,
    };
  }
  async getPaymentMethodInitial() {
    try {
      const res = await this.paymentMethodModel
        .find({}, { name: 1, value: 1 })
        .lean()
        .exec();
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}