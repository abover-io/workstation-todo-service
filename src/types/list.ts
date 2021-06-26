import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

export interface IList {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  color: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IListDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  color: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IListValidator {
  Id: (input: string) => Validation;
  UserId: (input: string) => Validation;
  Name: (input: string) => Validation;
  Color: (input: string) => Validation;
}

export interface IAddListFormValidations {
  userId: Validation;
  name: Validation;
  color: Validation;
}

export interface IAddListFormData {
  userId: string;
  name: string;
  color: string;
}

export interface IUpdateListFormValidations {
  _id: Validation;
  userId: Validation;
  name: Validation;
  color: Validation;
}

export interface IUpdateListFormData {
  _id: string;
  userId: string;
  name: string;
  color: string;
}
