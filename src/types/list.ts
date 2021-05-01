import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

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
  email: string;
  name: string;
  color: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface IListValidator {
  Id: (input: string) => Validation;
  Email: (input: string) => Validation;
  Name: (input: string) => Validation;
  Color: (input: string) => Validation;
}

export interface ICreateListFormValidations {
  email: Validation;
  name: Validation;
  color: Validation;
}

export interface ICreateListFormData {
  email: string;
  name: string;
  color: string;
}

export interface IUpdateListFormValidations {
  _id: Validation;
  email: Validation;
  name: Validation;
  color: Validation;
}

export interface IUpdateListFormData {
  _id: string;
  email: string;
  name: string;
  color: string;
}
