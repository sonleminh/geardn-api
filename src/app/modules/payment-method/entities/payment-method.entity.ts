import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentMethodDocument = HydratedDocument<PaymentMethod>;

@Schema({ collection: 'payment-methods', timestamps: true })
export class PaymentMethod {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, unique: true, type: String })
  name: string;

  @Prop({ require: true, type: String })
  image: string;

  @Prop({ require: true, unique: true, type: String })
  display_name: string;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
