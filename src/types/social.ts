import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface ISocialDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  socialId: string | number | Types.ObjectId;
  userId: Types.ObjectId;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}
