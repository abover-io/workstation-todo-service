import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null;
  verified: boolean;
  profileImageURL: string | null;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

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

export interface IUserValidator {
  Name: (input: string) => Validation;
  Email: (input: string) => Validation;
  Password: (input: string) => Validation;
}

export interface IUpdateUserFormValidations {
  _id: Validation;
  name: Validation;
}

export interface IUpdateUserFormData {
  _id: string;
  name: string;
}

export interface IUpdateUserPasswordFormValidations {
  _id: Validation;
  password: Validation;
}

export interface IUpdateUserPasswordFormData {
  _id: string;
  password: string;
}
