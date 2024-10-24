import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Model as ModelEntity } from './entities/model.entity';
import { CreateModelDto, UpdateModelDto } from './dto/model.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(Model.name) private modelModel: Model<ModelEntity>,
    private readonly productService: ProductService,
  ) {}

  async create(body: CreateModelDto) {
    try {
      return await this.modelModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  // async findAll() {
  //   try {
  //     const [res, total] = await Promise.all([
  //       this.ProductSkuModel.find().lean().exec(),
  //       this.ProductSkuModel.countDocuments(),
  //     ]);
  //     return { productSkuList: res, total };
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }

  async findById(id: string) {
    try {
      const res = await this.modelModel.findById(id).exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy loại hàng!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy loại hàng!');
    }
  }

  async findByProductId(id: string) {
    try {
      const res = await this.modelModel.find({ product: id }).lean().exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy loại hàng!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy loại hàng!');
    }
  }

  async initialForCreate() {
    const res = await this.productService.getCategoriesWithProducts();
    return { categoryList: res };
  }

  async update(id: string, body: UpdateModelDto) {
    const entity = await this.modelModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    const updatedEntity = { ...entity, ...body };

    // if (body.quantity !== undefined) {
    //   // Update status based on quantity
    //   updatedEntity.status = body.quantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
    // }

    // Perform the update and return the updated document
    return await this.modelModel
      .findByIdAndUpdate(id, updatedEntity, {
        new: true,
      })
      .exec();
  }

  // async remove(id: string): Promise<{ deletedCount: number }> {
  //   const entity = await this.ProductSkuModel.findById(id).lean();
  //   if (!entity) {
  //     throw new NotFoundException('Đối tượng không tồn tại!!');
  //   }

  //   const result = await this.ProductSkuModel.deleteOne({ _id: id }).exec();

  //   return {
  //     deletedCount: result.deletedCount,
  //   };
  // }
}
