import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ORDER_STATUS } from '../dto/order.dto';


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

  @Prop({})
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export class Address {
  @Prop({ required: true })
  street: number;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;
}

// Create the schema for the items array
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  address: Address;

  @Prop({ required: true })
  receiveOption: string;

  @Prop({})
  note: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    enum: ORDER_STATUS,
    require: true,
    type: String,
    default: ORDER_STATUS.PENDING,
  })
  status: string;

  // @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
  // paymentId: Types.ObjectId;

  // @Prop({ required: true })
  // payment_status: string; 
}

export const OrderSchema = SchemaFactory.createForClass(Order);