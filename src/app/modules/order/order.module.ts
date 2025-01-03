import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Model, ModelSchema } from '../model/entities/model.entity';
import { CartModule } from '../cart/cart.module';
import { Cart, CartSchema } from '../cart/entities/cart.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Model.name, schema: ModelSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    CartModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
