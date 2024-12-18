import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDTO: CreateCategoryDto) {
    try {
      const payload = createCategoryDTO;
      return await this.categoryModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const [res, total] = await Promise.all([
        this.categoryModel.find().lean().exec(),
        this.categoryModel.countDocuments(),
      ]);
      return { categoryList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    try {
      const res = await this.categoryModel.findById(id);
      if (!res) {
        throw new NotFoundException('Không tìm thấy danh mục!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy danh mục!');
    }
  }

  async update(id: string, body: UpdateCategoryDto): Promise<Category> {
    const entity = await this.categoryModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.categoryModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.categoryModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.categoryModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }

  async getCategoryInitial() {
    try {
      const res = await this.categoryModel
        .find({}, { name: 1, value: 1 })
        .lean()
        .exec();
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
