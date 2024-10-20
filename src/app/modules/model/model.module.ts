import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from './entities/model.entity';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { ProductModule } from '../product/product.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
    ProductModule,
  ],
  providers: [ModelService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}