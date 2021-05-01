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
