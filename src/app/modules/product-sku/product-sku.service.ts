import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectModel(ProductSku.name) private ProductSkuModel: Model<ProductSku>,
  ) {}

  async create(body: CreateProductSkuDto) {
    try {
      return await this.ProductSkuModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const [res, total] = await Promise.all([
        this.ProductSkuModel.find().lean().exec(),
        this.ProductSkuModel.countDocuments(),
      ]);
      return { categoryList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    return await this.ProductSkuModel.findById(id);
  }

  async update(id: string, body: UpdateProductSkuDto): Promise<ProductSku> {
    const entity = await this.ProductSkuModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.ProductSkuModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.ProductSkuModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.ProductSkuModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }
}
