import { Document } from 'mongoose';
import { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';

export interface IUser extends Document {
  _id: any;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: String[];
  apiKey: string;
}

export interface ITodo extends Document {
  _id: any;
  username: string;
  name: string;
  due: Date;
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  priority: number;
  position: number | any;
  createdAt: Date;
  updatedAt: Date;
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
