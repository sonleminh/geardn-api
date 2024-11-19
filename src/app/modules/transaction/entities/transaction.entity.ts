import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ collection: 'transaction', timestamps: true })
export class Transaction {
  @Prop({ required: true })
  gateway: string;

  @Prop({ required: true })
  transaction_date: Date;

  @Prop()
  account_number: string;

  @Prop()
  sub_account: string;

  @Prop({ required: true, default: 0 })
  amount_in: number;

  @Prop({ required: true, default: 0 })
  amount_out: number;

  @Prop({ required: true })
  accumulated: number;

  @Prop()
  transfer_type: string;

  @Prop()
  transfer_amount: number;

  @Prop()
  code: string;

  @Prop()
  transaction_content: string;

  @Prop()
  reference_number: string;

  @Prop()
  body: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
