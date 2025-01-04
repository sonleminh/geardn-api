import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginateCalculator } from 'src/app/utils/page-helpers';
import { CategoryService } from '../category/category.service';
import { FirebaseService } from '../firebase/firebase.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UploadProductDto,
} from './dto/product.dto';
import { TAGS } from './dto/tag.dto';
import { Product } from './entities/product.entity';
import { Model as ModelEntity } from '../model/entities/model.entity';
import { QueryParamDto } from 'src/app/dtos/query-params.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ModelEntity.name) private modelModel: Model<ModelEntity>,
    private readonly firebaseService: FirebaseService,
    private readonly categoryService: CategoryService,
    // private readonly modelService: ModelService,
  ) {}

  async createProduct(body: CreateProductDto) {
    try {
      return await this.productModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  async processExcelData(
    data: UploadProductDto[],
  ): Promise<{ message: string }> {
    try {
      const products = data.map((item, index) => {
        if (!item.name || !item.category) {
          this.logger.error(
            `Invalid data at index ${index}: ${JSON.stringify(item)}`,
          );
          throw new HttpException(
            `Missing required fields in row ${index + 1}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // const attributes = item.attributes ? item.attributes?.split(',') : [];
        const images = item.images ? item.images.split(',') : [];

        return {
          name: item.name,
          category: item.category,
          images: images,
          // sku_name: item.sku_name,
          // attributes,
        };
      });
      await this.productModel.insertMany(products);

      return { message: 'Products added successfully' };
    } catch (error) {
      this.logger.error(
        `Error processing Excel data: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An unexpected error occurred while processing the Excel data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async findAll(queryParam: QueryParamDto) {
    try {
      const filterObject = {
        is_deleted: { $ne: true },
        // ...(s?.length && {
        //   $or: [
        //     {
        //       title: {
        //         $regex: new RegExp(escapeRegExp(s), 'i'),
        //       },
        //     },
        //     {
        //       content: {
        //         $regex: new RegExp(escapeRegExp(s), 'i'),
        //       },
        //     },
        //   ],
        // }),
      };

      const { resPerPage, passedPage } = paginateCalculator(
        queryParam.page,
        queryParam.limit,
      );
      const pipeline = [];

      const [res, total] = await Promise.all([
        pipeline.length
          ? this.productModel.aggregate(pipeline).exec()
          : this.productModel
              .find(filterObject)
              .sort({ createdAt: -1 })
              .limit(resPerPage)
              .skip(passedPage)
              .populate('category', 'name')
              .lean()
              .exec(),

        this.productModel.countDocuments(filterObject),
      ]);
      const categories = await this.categoryService.getCategoryInitial();


      const products = await Promise.all(
        res.map(async (product) => {
          // Find the lowest price for each product's SKU
          const lowestPriceSku = await this.modelModel
            .findOne({ product: product._id }) // Match product ID
            .sort({ price: 1 }) // Sort by price in ascending order to get the lowest
            .select('price') // Only fetch the price field
            .lean()
            .exec();

          return {
            ...product,
            original_price: lowestPriceSku ? lowestPriceSku.price : null,
          };
        }),
      );

      return {
        products: products,
        categories: categories,
        total,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProducts() {
    try {
      const filterObject = {
        is_deleted: { $ne: true },
        _id: { $in: [] }, // Placeholder for productIds to be added later
      };

      // Step 1: Find all models and get their product references
      const models = await this.modelModel.find().select('product').exec();
      if (!models.length) {
        throw new NotFoundException('No models found in the database.');
      }

      // Step 2: Extract unique product IDs from models

      const productIds = models.map((model) => model.product).filter(Boolean);
      filterObject._id.$in = productIds;
      // Step 3: Fetch products matching the product IDs from the Product collection
      const [res, total] = await Promise.all([
        this.productModel.find(filterObject).exec(),
        this.productModel.countDocuments(filterObject),
      ]);

      const products = await Promise.all(
        res.map(async (product) => {
          // Find the lowest price for each product's SKU
          const lowestPriceSku = await this.modelModel
            .findOne({ product: product._id }) // Match product ID
            .sort({ price: 1 }) // Sort by price in ascending order to get the lowest
            .select('price') // Only fetch the price field
            .lean()
            .exec();

          return {
            ...product.toObject(),
            original_price: lowestPriceSku ? lowestPriceSku.price : null,
          };
        }),
      );

      return { products: products, total: total };
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
      const lowestPriceSku = await this.modelModel
        .findOne({ product: id }) // Match product ID
        .sort({ price: 1 }) // Sort by price in ascending order to get the lowest
        .select('price') // Only fetch the price field
        .lean()
        .exec();

      const models = await this.modelModel
        .find({ product: id }) // Match product ID
        .select('name price stock extinfo')
        .lean()
        .exec();

      const result = res.toObject() as Product & { original_price?: number };

      // Add original_price if lowestPriceSku is found
      if (lowestPriceSku && lowestPriceSku.price) {
        result.original_price = lowestPriceSku.price;
      }

      return { ...result, models, test: 'CI/CD 3' };
    } catch {
      throw new NotFoundException('Không tìm thấy sản phẩm!');
    }
  }

  async getProductByCateId(id: Types.ObjectId, queryParam) {
    try {
      const filterObject = {
        is_deleted: { $ne: true },
      };

      const { resPerPage, passedPage } = paginateCalculator(
        queryParam.page,
        queryParam.limit,
      );

      const res = await this.productModel
        .find({ category: id })
        .select('name category tags images')
        .sort({ createdAt: -1 })
        .limit(resPerPage)
        .skip(passedPage)
        .populate('category', 'name')
        .lean()
        .exec();

      return await Promise.all(
        res.map(async (product) => {
          // Find the lowest price for each product's SKU
          const lowestPriceSku = await this.modelModel
            .findOne({ product: product._id }) // Match product ID
            .sort({ price: 1 }) // Sort by price in ascending order to get the lowest
            .select('price') // Only fetch the price field
            .lean()
            .exec();

          return {
            ...product,
            original_price: lowestPriceSku ? lowestPriceSku.price : null,
          };
        }),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProductByCateSlug(slug: string, queryParam) {
    try {
      const category = await this.categoryService.findBySlug(slug);

      const filterObject = {
        is_deleted: { $ne: true },
      };

      const { resPerPage, passedPage } = paginateCalculator(
        queryParam.page,
        queryParam.limit,
      );

      const res = await this.productModel
        .find({ category: category._id.toString() })
        .select('name category tags images')
        .sort({ createdAt: -1 })
        .limit(resPerPage)
        .skip(passedPage)
        .populate('category', 'name')
        .lean()
        .exec();
      return await Promise.all(
        res.map(async (product) => {
          // Find the lowest price for each product's SKU
          const lowestPriceSku = await this.modelModel
            .findOne({ product: product._id }) // Match product ID
            .sort({ price: 1 }) // Sort by price in ascending order to get the lowest
            .select('price') // Only fetch the price field
            .lean()
            .exec();

          return {
            ...product,
            original_price: lowestPriceSku ? lowestPriceSku.price : null,
          };
        }),
      );
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

  async softDelete(id: string): Promise<{ deleteCount: number }> {
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

  async softDeleteMany(ids: string[]): Promise<number> {
    const res = await this.productModel.updateMany(
      { _id: { $in: ids }, is_deleted: false },
      { $set: { is_deleted: true } },
    );

    return res.modifiedCount;
  }
}
