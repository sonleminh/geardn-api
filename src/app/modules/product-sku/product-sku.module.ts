import { Module } from '@nestjs/common';
import { ProductSkuService } from './product-sku.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSku, ProductSkuSchema } from './entities/product-sku.entity';
import { ProductSkuController } from './product-sku.controller';
import { ProductModule } from '../product/product.module';
import { AttributeModule } from '../attribute/attribute.module';
import { CategoryModule } from '../category/category.module';

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
})
export class ProductSkuModule {}
