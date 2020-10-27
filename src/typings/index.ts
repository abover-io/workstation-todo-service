import { Document, Types } from 'mongoose';
import { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  password?: string;
  verified: boolean;
  profileImageURL?: string;
  refreshTokens: String[];
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISocial extends Document {
  _id: Types.ObjectId;
  name: string;
  socialId: string | number | Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ITodo extends Document {
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

export interface ISignUpValidations {
  [key: string]: string | any;
  firstName: string | any;
  username: string | any;
  email: string | any;
  password: string | any;
}

export interface ISignInValidations {
  [key: string]: string | any;
  userIdentifier: string | any;
  password: string | any;
}

export interface CustomHttpError extends HttpError {
  messages?: HttpError[];
}

export interface IUserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IStartApiOptions {
  port: number;
  env: 'development' | 'test' | 'production' | string;
}

export interface IHandleRefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export interface IUpdateUserValidations {
  [key: string]: string | any;
  firstName: string | any;
  email: string | any;
}

export interface IStopApiOptions {
  env: 'development' | 'test' | 'production';
  db: 'drop' | 'hold';
}

export interface IRequestIO extends Request {
  io: Server;
}
