import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

export interface ITodo {
  _id?: Types.ObjectId;
  username: string;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  priority: string;
  listId: Types.ObjectId;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export interface ITodoDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  dueDate: string | null;
  dueTime: string | null;
  completed: boolean;
  priority: string;
  listId: Types.ObjectId;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}
