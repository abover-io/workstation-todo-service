import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface ITodo {
  _id?: Types.ObjectId;
  listId: Types.ObjectId;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  completed: boolean;
  priority: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface ITodoDocument extends Document {
  _id: Types.ObjectId;
  listId: Types.ObjectId;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  completed: boolean;
  priority: string;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}
