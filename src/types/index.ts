import { Request } from 'express';
import { HttpError } from 'http-errors';

// Types
import { IUser } from '@/types/user';

export interface ICustomRequest extends Request {
  user?: IUser;
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
