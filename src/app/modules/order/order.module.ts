import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController, OrderController } from './order.controller';
import { CartService, OrderService } from './order.service';
import { Cart, CartSchema, Order, OrderSchema } from './entities/order.entity';
import { Model, ModelSchema } from '../model/entities/model.entity';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
