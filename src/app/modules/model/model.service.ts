import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      const existedModel = await this.modelModel
        .findOne({ product: body.product, name: body.name })
        .lean()
        .exec();

      if (existedModel) {
        throw new BadRequestException('This model already exists');
      }

      const count = await this.modelModel.countDocuments({
        product: body.product,
      });
      const newBody = {
        ...body,
        sku: body.extinfo.tier_index
          ? `${body.sku}-` + (count + 1).toString().padStart(3, '0')
          : body.sku,
      };

      const res = await this.modelModel.create(newBody);
      return { status: HttpStatus.CREATED, message: 'success', data: res };
    } catch (error) {
      throw error;
    }
  }

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
    return { categories: res };
  }

  async update(id: string, body: UpdateModelDto) {
    const { sku, ...restBody } = body;
    const existedModel = await this.modelModel
      .find({ product: body.product })
      .lean()
      .exec();
    if (!existedModel) {
      throw new NotFoundException(`This model does not exist!!`);
    }

    const isExisted = existedModel
      ?.find((model) => model.name === body.name)
      ?._id.toString();

    if (isExisted) {
      throw new NotFoundException(`This model already exists!!`);
    }

    const model = existedModel.find((model) => model._id.toString() === id);

    const updatedEntity = { ...model, ...restBody };

    return await this.modelModel
      .findByIdAndUpdate(id, updatedEntity, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.modelModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.modelModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }
}
