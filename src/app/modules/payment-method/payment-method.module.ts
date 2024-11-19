import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethod, PaymentMethodSchema } from './entities/payment-method.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
  ],
  providers: [PaymentMethodService],
  controllers: [PaymentMethodController],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}