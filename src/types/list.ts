import { Document, Types } from 'mongoose';

export interface IList {
  _id?: Types.ObjectId;
  username: string;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IListDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}
