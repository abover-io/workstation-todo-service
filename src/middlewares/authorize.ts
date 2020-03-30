import createError from 'http-errors';
import { Types } from 'mongoose';

import User from '../models/user';
import Todo from '../models/todo';

const { ObjectId } = Types;

class Authorize {
  async authorizeUser(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const foundUser = await User.findOne({ _id: ObjectId(userId) });
      if (!foundUser) {
        throw createError({
          name: 'AuthorizationError',
          message: 'You are unauthorized!'
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }

  async authorizeTodo(req: any, res: any, next: any) {
    try {
      const { userId, todoId } = req.params;
      const foundTodo: any = await Todo.findOne({
        _id: ObjectId(todoId)
      });
      if (foundTodo.userId.toString() !== userId) {
        throw createError({name: 'AuthorizationError', message: 'You are not authorized to do this!'});
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}

export default Authorize;
