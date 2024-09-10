import { Types } from 'mongoose';

export interface ILoginResponse {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  role: string;
}