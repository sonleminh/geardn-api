import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributeModule } from '../attribute/attribute.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { ProductSku, ProductSkuSchema } from './entities/model.entity';
import { ProductSkuController } from './product-sku.controller';
import { ProductSkuService } from './product-sku.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSku.name, schema: ProductSkuSchema },
    ]),
    ProductModule,
    AttributeModule,
    CategoryModule,
  ],
  providers: [ProductSkuService],
  controllers: [ProductSkuController],
  exports: [ProductSkuService],
})
export class ProductSkuModule {}