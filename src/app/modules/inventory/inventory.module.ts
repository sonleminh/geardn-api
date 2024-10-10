// import { Module } from '@nestjs/common';
// import { InventoryService } from './inventory.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Inventory, InventorySchema } from './entities/inventory.entity';
// import { ProductModule } from '../product/product.module';
// import { AttributeModule } from '../attribute/attribute.module';
// import { CategoryModule } from '../category/category.module';
// import { InventoryController } from './inventory.controller';
// import { ProductSkuModule } from '../product-sku/product-sku.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Inventory.name, schema: InventorySchema },
//     ]),
//     ProductModule,
//     AttributeModule,
//     CategoryModule,
//   ],
//   providers: [InventoryService],
//   controllers: [InventoryController],
//   exports: [InventoryService],

// })
// export class InventoryModule {}
