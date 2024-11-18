import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethod, PaymentMethodSchema } from './entities/payment-method.entity';
import { PaymentMethodController } from './payment-method.controller';

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
