import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { ProductService } from './product.service';
import { ProductSku, ProductSkuSchema } from '../product-sku/entities/product-sku.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductSku.name, schema: ProductSkuSchema },
    ]),
    forwardRef(() => AuthModule),
    FirebaseModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
