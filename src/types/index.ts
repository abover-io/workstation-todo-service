import { Request } from 'express';

// Types
import { IUser } from '@/types/user';

export interface ICustomRequest extends Request {
  user: IUser;
}

export type Validation = {
  error: boolean;
  text: string;
};
