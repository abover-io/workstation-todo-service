import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null;
  verified: boolean;
  profileImageURL: string | null;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}
