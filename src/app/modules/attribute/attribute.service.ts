import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
  ) {}

  async create(body: CreateAttributeDto) {
    try {
      return await this.attributeModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const [res, total] = await Promise.all([
        this.attributeModel.find().lean().exec(),
        this.attributeModel.countDocuments(),
      ]);
      return { categoryList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    return await this.attributeModel.findById(id);
  }

  async update(id: string, body: UpdateAttributeDto): Promise<Attribute> {
    const entity = await this.attributeModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.attributeModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.attributeModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.attributeModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }
}
