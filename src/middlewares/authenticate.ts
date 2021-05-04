import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

// Config
import { JWT_ACCESS_SECRET } from '@/config';

// Types
import { ICustomRequest } from '@/types';
import { IUser } from '@/types/user';

// Models
import { User } from '@/models';

export default async (req: Request, res: Response, next: NextFunction) => {
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

    const user: IUser | any = jwt.verify(act, JWT_ACCESS_SECRET);

    if (user) {
      const foundUser: IUser | null = await User.findOne({
        $or: [
          {
            username: user.username,
          },
          {
            email: user.email,
          },
        ],
      });

      if (!foundUser) {
        throw createError(401, {
          message: 'Please sign in to continue!',
        });
      } else {
        (<ICustomRequest>req).user = user;
        return next();
      }
    }
  } catch (err) {
    return next(err);
  }
};
