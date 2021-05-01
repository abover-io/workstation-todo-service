import { Document, Types } from 'mongoose';
import { Moment } from 'moment';

// Types
import { Validation } from '@/types';

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
  priority: TodoPriority;
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
  priority: TodoPriority;
  createdAt?: Date | Moment | string;
  updatedAt?: Date | Moment | string;
}

export type TodoPriority = 'none' | 'low' | 'medium' | 'high';

export interface ITodoValidator {
  Id: (input: string) => Validation;
  ListId: (input: string) => Validation;
  Name: (input: string) => Validation;
  Notes: (input: string | null) => Validation;
  URL: (input: string | null) => Validation;
  IsDateSet: (input: boolean) => Validation;
  IsTimeSet: (input: boolean) => Validation;
  Due: (input: string | null) => Validation;
  Priority: (input: string) => Validation;
}
