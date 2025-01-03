import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './app/modules/category/entities/category.entity';
import { Model, Types } from 'mongoose';
import { ProductService } from './app/modules/product/product.service';
import { QueryParamDto } from './app/dtos/query-params.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly productService: ProductService,
  ) {}

  getHello(): string {
    return 'Welcome to GearDN api!';
  }

  async getResourceByParams(
    slug: string,
    id: Types.ObjectId,
    queryParam: QueryParamDto,
  ) {
    const lastDashIndex = slug.lastIndexOf('-');

    // Extract slug and type
    const slugParam = slug.substring(0, lastDashIndex);
    const type = slug.substring(lastDashIndex + 1);
    console.log(slugParam, type);
    if (type === 'i') {
      const res = await this.productService.getProductById(id);
      return { status: HttpStatus.OK, message: 'success', data: res };
    } else if (type === 'cat') {
      const res = await this.productService.getProductByCategory(
        id,
        queryParam,
      );
      return { status: HttpStatus.OK, message: 'success', data: res };
    } else {
      return { error: 'Invalid type' };
    }
  }
}
