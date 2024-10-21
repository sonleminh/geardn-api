import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type ModelDocument = HydratedDocument<Model>;

class ExtInfo {
  @Prop()
  tier_index: number[];
  
  @Prop({ require: true, default: false })
  is_pre_order: boolean;
} 

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

  @Prop({ require: true })
  extinfo: ExtInfo;
}

export const ModelSchema = SchemaFactory.createForClass(Model);