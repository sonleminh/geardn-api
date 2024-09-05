import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id?: Types.ObjectId;

  @Prop({ require: true, trim: true })
  password: string;

  @Prop({ require: true })
  email: string;

  @Prop({ require: true })
  fullName: string;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
