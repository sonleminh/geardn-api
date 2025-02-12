import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, unique: true, type: String })
  name: string;

  @Prop({ require: true, type: String })
  icon: string;

  @Prop({ require: true, type: String })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
