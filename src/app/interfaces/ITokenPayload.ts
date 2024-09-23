import { Types } from 'mongoose';
import { User } from '../modules/user/entities/user.entity';

export interface ITokenPayload extends Pick<User, 'email'> {
  _id: Types.ObjectId;
  name: string;
  role: string;
}
