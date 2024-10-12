import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ProductSku } from './entities/product-sku.entity';
import {
  CreateProductSkuDto,
  UpdateProductSkuDto,
} from './dto/product-sku.dto';
import { ProductService } from '../product/product.service';
import { AttributeService } from '../attribute/attribute.service';
import { CategoryService } from '../category/category.service';
import { Attribute } from '../attribute/entities/attribute.entity';

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectModel(ProductSku.name) private ProductSkuModel: Model<ProductSku>,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly attributeService: AttributeService,
  ) {}

  async create(body: CreateProductSkuDto) {
    try {
      body.status = body.quantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
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
      return { productSkuList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    try {
      const res = await this.ProductSkuModel.findById(id)
        .populate({
          path: 'attributes',
          model: Attribute.name,
          select: ['name', 'value'],
        })
        .exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy SKU!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy SKU!');
    }
  }

  async findByProductId(id: string) {
    try {
      const res = await this.ProductSkuModel.find({ product_id: id })
        .lean()
        .exec();
      if (!res) {
        throw new NotFoundException('Không tìm thấy SKU!');
      }
      return res;
    } catch {
      throw new NotFoundException('Không tìm thấy SKU!');
    }
  }

  async initialForCreate() {
    const [categoryList, attributeList] = await Promise.all([
      await this.productService.getCategoriesWithProducts(),
      await this.attributeService.getInitialAttributeList(),
    ]);

    return { categoryList, attributeList };
  }

  async update(id: string, body: UpdateProductSkuDto): Promise<ProductSku> {
    const entity = await this.ProductSkuModel.findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    const updatedEntity = { ...entity, ...body };

    if (body.quantity !== undefined) {
      // Update status based on quantity
      updatedEntity.status = body.quantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
    }

    // Perform the update and return the updated document
    return await this.ProductSkuModel.findByIdAndUpdate(id, updatedEntity, {
      new: true,
    }).exec();
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
