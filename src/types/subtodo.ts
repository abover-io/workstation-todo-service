import { Types, Document } from 'mongoose';
import { Moment } from 'moment';

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
