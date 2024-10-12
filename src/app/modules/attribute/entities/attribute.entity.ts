import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { TYPE_ATTRIBUTE } from '../dto/attribute.dto';

export type AttributeDocument = HydratedDocument<Attribute>;

@Schema({ collection: 'attributes', timestamps: true })
export class Attribute {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ enum: TYPE_ATTRIBUTE, require: true, type: String })
  name: TYPE_ATTRIBUTE;

  @Prop({ required: true, unique: true, type: String })
  value: string;

  @Prop({ required: true, unique: true, type: String })
  atb_sku: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
