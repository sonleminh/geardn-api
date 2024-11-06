import { BadRequestException } from '@nestjs/common';
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
  product: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  sku: string;

  @Prop({ require: true, type: Number })
  price: number;

  @Prop({ require: true, type: Number, default: 0 })
  stock: number;

  @Prop({ require: true })
  extinfo: ExtInfo;
}

export const ModelSchema = SchemaFactory.createForClass(Model);

ModelSchema.pre<ModelDocument>('save', async function (next) {
  // Only check for duplicates if tier_index is defined
  if (this.extinfo?.tier_index && this.extinfo.tier_index.length > 0) {
    const existingDoc = await this.model('Model').findOne({
      'extinfo.tier_index': { $eq: this.extinfo.tier_index },
    });

    if (existingDoc && existingDoc._id.toString() !== this._id.toString()) {
      throw new BadRequestException('Duplicate tier_index detected');
    }
  }
  next();
});