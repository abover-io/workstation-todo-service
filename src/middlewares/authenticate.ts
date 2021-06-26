import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

// Config
import { JWT_ACCESS_SECRET } from '@/config';

// Types
import { ICustomRequest } from '@/types';
import { IUser } from '@/types/user';

export default async (req: Request, _: Response, next: NextFunction) => {
  try {
    const act: string =
      req.signedCookies.act ||
      req.cookies.act ||
      req.headers.authorization?.split(' ')[1] ||
      req.headers['X-ACT'] ||
      req.headers['x-act'] ||
      req.body.act;

    if (!act) {
      throw createError(401, {
        message: 'No access token provided!',
      });
    }

    let user: IUser | any = jwt.verify(act, JWT_ACCESS_SECRET);

    if (user) {
      user = {
        ...user,
        _id: Types.ObjectId(user._id),
      } as IUser;

      (<ICustomRequest>req).user = user;
      return next();
    }

    throw createError(401, {
      message: 'Please sign in to continue!',
    });
  } catch (err) {
    return next(err);
  }
};
