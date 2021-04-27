import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface IList {
  _id?: Types.ObjectId;
  email: string;
  name: string;
  color: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IListDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  name: string;
  color: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}
