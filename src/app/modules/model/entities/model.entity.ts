import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type ModelDocument = HydratedDocument<Model>;

@Schema({ collection: 'models', timestamps: true })
export class Model {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, type: String })
  product_id: string;

  @Prop({ require: true, type: String })
  name: string;

  @Prop({ require: true, type: Number })
  price: number;

  @Prop({ require: true, type: Number, default: 0 })
  stock: number;
}

export const ModelSchema = SchemaFactory.createForClass(Model);