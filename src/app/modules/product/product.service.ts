import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FirebaseService } from '../firebase/firebase.service';
import { Product } from './entities/product.entity';
import { escapeRegExp } from 'src/app/utils/escapeRegExp';
import { paginateCalculator } from 'src/app/utils/page-helpers';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { TAGS } from './dto/tag.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly firebaseService: FirebaseService,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(body: CreateProductDto) {
    try {
      return await this.productModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  async getInitialProductForCreate() {
    const categories = await this.categoryService.getCategoryInitial();
    const tags = Object.keys(TAGS).map((key) => ({
      value: key,
      label: TAGS[key as keyof typeof TAGS],
    }));
    return { categories, tags: tags };
  }

  async getInitialProductList() {
    try {
      const res = await this.productModel
        .find({}, { _id: 1, name: 1, category: 1 })
        .lean()
        .exec();
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll({ s, page, limit, find_option }) {
    try {
      const filterObject = {
        is_deleted: { $ne: true },
        ...(s?.length && {
          $or: [
            {
              title: {
                $regex: new RegExp(escapeRegExp(s), 'i'),
              },
            },
            {
              content: {
                $regex: new RegExp(escapeRegExp(s), 'i'),
              },
            },
          ],
        }),
      };

      const { resPerPage, passedPage } = paginateCalculator(page, limit);

      const pipeline = [];

      const [res, total] = await Promise.all([
        pipeline.length
          ? this.productModel.aggregate(pipeline).exec()
          : this.productModel
              .find(filterObject)
              .limit(resPerPage)
              .skip(passedPage)
              .populate('category', 'name')
              .lean()
              .exec(),

        this.productModel.countDocuments(filterObject),
      ]);
      const categories = await this.categoryService.getCategoryInitial();

      return {
        productList: res,
        categories: categories,
        total,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductById(id: Types.ObjectId) {
    try {
      const res = await this.productModel
        .findById(id)
        .populate('category', 'name');
      if (!res) {
        throw new NotFoundException('Không tìm thấy sản phẩm!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy sản phẩm!');
    }
  }

  async getProductByCategory(id: string) {
    try {
      const res = await this.productModel.find({ category: id }).lean().exec();
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: Types.ObjectId, body: UpdateProductDto) {
    const entity = await this.productModel
      .findById(id)
      .where({ is_deleted: { $ne: true } })
      .lean();

    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const newData = {
      ...entity,
      ...body,
    };

    // if (images) {
    //   const [imageUrl] = await Promise.all([
    //     this.firebaseService.uploadFile(images),
    //     this.firebaseService.deleteFile(entity.images),
    //   ]);
    //   newData = {
    //     ...newData,
    //     images: imageUrl,
    //   };
    // }
    return await this.productModel
      .findByIdAndUpdate(id, newData, {
        new: true,
      })
      .exec();
  }

  async deleteSoft(id: string): Promise<{ deleteCount: number }> {
    const entity = await this.productModel
      .findById(id)
      .where({ is_deleted: { $ne: true } })
      .lean()
      .exec();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }
    await this.productModel
      .findByIdAndUpdate(id, { is_deleted: true }, { new: true })
      .exec();
    return {
      deleteCount: 1,
    };
  }

  async getCategoriesWithProducts() {
    try {
      const res = await this.productModel
        .aggregate([
          {
            $match: { is_deleted: false },
          },
          {
            $group: {
              _id: '$category',
            },
          },
          {
            // Convert the _id (category field) to ObjectId for lookup if needed
            $addFields: {
              categoryObjectId: { $toObjectId: '$_id' }, // Convert to ObjectId
            },
          },
          {
            $lookup: {
              from: 'categories', // Category collection
              localField: 'categoryObjectId', // Use the converted ObjectId
              foreignField: '_id', // Match with _id in the categories collection
              as: 'categoryDetails',
            },
          },
          {
            $unwind: '$categoryDetails',
          },
          {
            $project: {
              _id: '$_id', // Original category ID
              name: '$categoryDetails.name', // Category name from details
            },
          },
        ])
        .exec();
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
