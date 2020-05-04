import createError from 'http-errors';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from "express";

import User, { IUserModel } from '../models/user';
import Todo, { ITodoModel } from '../models/todo';

const { ObjectId } = Types;

export default class Authorize {
  static async authorizeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = (<any>req)['user'];
      const { username } = req.params;
      const foundUser: IUserModel | any = await User.findOne({ username });
      
      if (!foundUser) {
        throw createError({
          name: 'AuthorizationError',
          message: 'Not authorized, no user found according to provided username.'
        });
      } else {
        if (username == user.username) {
          next();
        } else {
          throw createError({
            name: 'AuthorizationError',
            message: 'Not authorized.'
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async authorizeTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = (<any>req)['user'];
      const { username, todoId } = req.params;
      const foundTodo: ITodoModel | any = await Todo.findOne({
        $and: [
          {
            _id: ObjectId(todoId)
          },
          {
            username
          }
        ]
      });

      if (!foundTodo) {
        throw createError({ name: "NotFoundError", message: "No todo found!" });
      } else if (foundTodo.username != user.username) {
        throw createError({name: 'AuthorizationError', message: `Not authorized! Username doesn't match.`});
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}
