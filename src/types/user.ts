import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null;
  photo: string | null;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null;
  photo: string | null;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IUserValidator {
  Name: (input: string) => Validation;
  Email: (input: string) => Validation;
  Password: (input: string) => Validation;
}
