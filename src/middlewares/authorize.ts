import createError from 'http-errors';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { verify as verifyJWT } from 'jsonwebtoken';

import { IUser, ITodo } from '@/types';
import { User, Todo } from '@/models';
import { JWT_ACCESS_SECRET } from '@/config';

const { ObjectId } = Types;

export default class Authorize {
  static async authorizeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken: string =
      req.cookies.act ||
      req.headers.authorization?.split(' ')[1] ||
      req.headers['X-ACT'] ||
      req.headers['x-act'] ||
      req.body.act;
      const user: IUser = (<any>req)['user'];
      const { username }: any = verifyJWT(accessToken, JWT_ACCESS_SECRET);
      const foundUser: IUser | any = await User.findOne({ username });

      if (!foundUser) {
        throw createError({
          name: 'AuthorizationError',
          message:
            'Not authorized, no user found according to provided username.',
        });
      } else {
        if (username == user.username) {
          next();
        } else {
          throw createError({
            name: 'AuthorizationError',
            message: 'Not authorized.',
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async authorizeTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username }: IUser = (<any>req).user;
      const { todoId } = req.params;
      const foundTodo: ITodo | any = await Todo.findOne({
        $and: [
          {
            _id: ObjectId(todoId),
          },
          {
            username,
          },
        ],
      });

      if (!foundTodo) {
        throw createError({ name: 'NotFoundError', message: 'No todo found!' });
      } else if (foundTodo.username != username) {
        throw createError({
          name: 'AuthorizationError',
          message: `Not authorized! Username doesn't match.`,
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}
