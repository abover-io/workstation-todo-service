import { Request, Response, NextFunction } from 'express';
import { verify as verifyJWT } from 'jsonwebtoken';
import createError from 'http-errors';

import { IUser } from '@/types';
import { User } from '@/models';
import { JWT_ACCESS_SECRET } from '@/config';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken: string =
      req.cookies.act ||
      req.headers.authorization?.split(' ')[1] ||
      req.headers['X-ACT'] ||
      req.headers['x-act'] ||
      req.body.act;

    if (!accessToken) {
      throw createError({
        name: 'AuthorizationError',
        message: 'No access token provided.'
      });
    }

    const user: IUser | any = verifyJWT(accessToken, JWT_ACCESS_SECRET);

    if (user) {
      const foundUser: IUser | any = await User.findOne({
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
        throw createError({
          name: 'AuthorizationError',
          message: 'Not Authorized.',
        });
      } else {
        (<any>req)['user'] = user;
        return next();
      }
    }
  } catch (err) {
    return next(err);
  }
};
