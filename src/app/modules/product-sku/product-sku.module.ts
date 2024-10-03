import { Module } from '@nestjs/common';
import { AttributeService } from './product-sku.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Attribute, AttributeSchema } from './entities/product-sku.entity';
import { AttributeController } from './product-sku.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attribute.name, schema: AttributeSchema },
    ]),
  ],
  providers: [AttributeService],
  controllers: [AttributeController],
  exports: [AttributeService],
})
export class AttributeModule {}
