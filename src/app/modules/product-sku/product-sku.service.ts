import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ProductSku } from './entities/product-sku.entity';
import { UpdateProductSkuDto } from './dto/product-sku.dto';
import { ProductService } from '../product/product.service';
import { AttributeService } from '../attribute/attribute.service';

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectModel(ProductSku.name) private ProductSkuModel: Model<ProductSku>,
    private readonly productService: ProductService,
    private readonly attributeService: AttributeService,
  ) {}

  async create(body: any) {
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
      return { skuList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    return await this.ProductSkuModel.findById(id).populate('product');
  }

  async initialForCreate() {
    const [initialProductList, initialAttributeList] = await Promise.all([
      await this.productService.getInitialProductList(),
      await this.attributeService.getInitialAttributeList(),
    ]);

    return { initialProductList, initialAttributeList };
  }

  async update(id: string, body: UpdateProductSkuDto): Promise<ProductSku> {
    const entity = await this.ProductSkuModel.findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.ProductSkuModel.findByIdAndUpdate(
      id,
      { ...entity, ...body },
      { new: true },
    ).exec();
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
