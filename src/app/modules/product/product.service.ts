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

      let pipeline = [];

      if (find_option === 'HOME') {
        pipeline = [
          { $match: filterObject },
          {
            $facet: {
              // recent_articles: [{ $sort: { date: -1 } }, { $limit: 10 }],
              FE_articles: [
                { $match: { 'tags.value': 'front-end' } },
                { $limit: 6 },
              ],
              BE_articles: [
                { $match: { 'tags.value': 'back-end' } },
                { $limit: 6 },
              ],
              trending_articles: [{ $sort: { views: -1 } }, { $limit: 4 }],
            },
          },
        ];
      }

      const [res, total] = await Promise.all([
        pipeline.length
          ? this.productModel.aggregate(pipeline).exec()
          : this.productModel
              .find(filterObject)
              .limit(resPerPage)
              .skip(passedPage)
              .lean()
              .exec(),

        this.productModel.countDocuments(filterObject),
      ]);

      if (pipeline.length) {
        const { FE_articles, BE_articles, recent_articles, trending_articles } =
          res[0];

        return {
          recent_articles,
          FE_articles,
          BE_articles,
          trending_articles,
          total,
        };
      }

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
      const product = await this.productModel.findById(id);
      return product;
    } catch {
      throw new NotFoundException('Không tìm thấy sản phẩm!');
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
}
