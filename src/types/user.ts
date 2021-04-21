import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  password?: string;
  verified: boolean;
  profileImageURL?: string;
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  password?: string;
  verified: boolean;
  profileImageURL?: string;
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}
