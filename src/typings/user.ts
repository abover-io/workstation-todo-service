import { Document, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  password?: string;
  verified: boolean;
  profileImageURL?: string;
  refreshTokens: String[];
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  password?: string;
  verified: boolean;
  profileImageURL?: string;
  refreshTokens: String[];
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}
