import { Module } from '@nestjs/common';
import { ProductSkuService } from './product-sku.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSku, ProductSkuSchema } from './entities/product-sku.entity';
import { ProductSkuController } from './product-sku.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSku.name, schema: ProductSkuSchema },
    ]),
  ],
  providers: [ProductSkuService],
  controllers: [ProductSkuController],
  exports: [ProductSkuService],
})
export class ProductSkuModule {}
