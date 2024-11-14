import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type OrderDocument = HydratedDocument<Order>;

// Define the item sub-schema
@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Model', required: true })
  model_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export class Address {
  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  ward: string;

  @Prop()
  address: string;
}

// Create the schema for the items array
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop()
  address: Address;

  @Prop({ required: true })
  receive_option: string;

  @Prop({})
  note: string;

  @Prop({ required: true })
  total_amount: number;

  @Prop({ default: 'pending' })
  status: string;

  // @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
  // paymentId: Types.ObjectId;

  // @Prop({ required: true })
  // payment_status: string; 
}

export const OrderSchema = SchemaFactory.createForClass(Order);