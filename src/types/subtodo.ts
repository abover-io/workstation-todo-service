import { Types, Document } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

export interface ISubtodo {
  _id?: Types.ObjectId;
  name: string;
  todoId: Types.ObjectId;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface ISubtodoDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  todoId: Types.ObjectId;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface ISubtodoValidator {
  Id: (input: string) => Validation;
  Name: (input: string) => Validation;
  TodoId: (input: string) => Validation;
}

export interface ICreateSubtodoFormValidations {
  name: Validation;
  todoId: Validation;
}

export interface ICreateSubtodoFormData {
  name: string;
  todoId: string;
}

export interface IUpdateSubtodoFormValidations {
  _id: Validation;
  name: Validation;
  todoId: Validation;
}

export interface IUpdateSubtodoFormData {
  _id: string;
  name: string;
  todoId: string;
}
