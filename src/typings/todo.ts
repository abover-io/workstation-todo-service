import { Document, Types } from 'mongoose';

export interface ITodo {
  _id?: Types.ObjectId;
  username: string;
  name: string;
  due: Date;
  isTimeSet: boolean;
  dueDate?: string;
  dueTime?: string;
  completed?: boolean;
  priority: number;
  position?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITodoDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  name: string;
  due: Date;
  isTimeSet: boolean;
  dueDate?: string;
  dueTime?: string;
  completed?: boolean;
  priority: number;
  position?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
