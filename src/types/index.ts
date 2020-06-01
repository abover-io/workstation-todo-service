import { Document } from 'mongoose';

export interface IUser extends Document {
  userId: any;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: String[];
  apiKey: string;
}

export interface ITodo extends Document {
  _id: any;
  username: string;
  name: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
