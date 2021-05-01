import { Types } from 'mongoose';
import { hashSync } from 'bcryptjs';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

// Typings
import { ICustomRequest } from '@/types';
import {
  IUserDocument,
  IUpdateUserFormValidations,
  IUpdateUserFormData,
  IUpdateUserPasswordFormValidations,
  IUpdateUserPasswordFormData,
} from '@/types/user';
import { ISocialDocument } from '@/types/social';
import { IListDocument } from '@/types/list';
import { ITodoDocument } from '@/types/todo';
import { ISubtodoDocument } from '@/types/subtodo';

// Models
import { User, Social, List, Todo, Subtodo } from '@/models';

// Utils
import { UserValidator } from '@/utils/validator';

export default class UserController {
  public static async UpdateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const formData: IUpdateUserFormData = {
        _id: req.params.userId || req.query.userId || req.body._id,
        name: req.body.name,
      };

      const validations: IUpdateUserFormValidations = {
        _id: UserValidator.Id(formData._id),
        name: UserValidator.Name(formData.name),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Please correct user validations!',
          validations,
        });
      }

      const updatedUser: IUserDocument | null = await User.findOneAndUpdate(
        {
          $and: [
            {
              _id: Types.ObjectId(formData._id),
            },
            {
              email,
            },
          ],
        },
        {
          name: formData.name,
        },
        {
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!updatedUser) {
        throw createError(404, {
          message: `User with ID ${formData._id} is not found!`,
        });
      }

      return res.status(200).json({
        message: 'Successfully updated user!',
        user: updatedUser,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async UpdatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const formData: IUpdateUserPasswordFormData = {
        _id: req.params.userId || req.query.userId || req.body._id,
        password: req.body.password,
      };

      const validations: IUpdateUserPasswordFormValidations = {
        _id: UserValidator.Id(formData._id),
        password: UserValidator.Password(formData.password),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Please correct user validations!',
          validations,
        });
      }

      const hashedPassword = hashSync(formData.password, 10);

      const updatedUser: IUserDocument | null = await User.findOneAndUpdate(
        {
          $and: [
            {
              _id: Types.ObjectId(formData._id),
            },
            {
              email,
            },
          ],
        },
        {
          password: hashedPassword,
        },
        {
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      return res.status(200).json({
        message: 'Successfully updated user password!',
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async DeleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const _id: string | any = req.params.userId || req.query.subtodoId;
      const validation = UserValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const deletedUser: IUserDocument | null = await User.findOne(
        {
          $and: [
            {
              _id: Types.ObjectId(_id),
            },
            {
              email,
            },
          ],
        },
        {
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!deletedUser) {
        throw createError(404, {
          message: `User with ID ${_id} is not found!`,
        });
      }

      const deletedSocial: ISocialDocument | null = await Social.findOne({
        userId: deletedUser._id,
      });

      const deletedLists: IListDocument[] = await List.find({
        email,
      });

      const deletedTodos: ITodoDocument[] = await Todo.find({
        listId: {
          $in: deletedLists.map((list) => list._id),
        },
      });

      const deletedSubtodos: ISubtodoDocument[] = await Subtodo.find({
        todoId: {
          $in: deletedTodos.map((todo) => todo._id),
        },
      });

      // Delete Process
      await Promise.all([
        Subtodo.deleteMany({
          _id: {
            $in: deletedSubtodos.map((subtodo) => subtodo._id),
          },
        }),
        Todo.deleteMany({
          _id: {
            $in: deletedTodos.map((todo) => todo._id),
          },
        }),
        List.deleteMany({
          _id: {
            $in: deletedLists.map((list) => list._id),
          },
        }),
        Social.deleteOne({
          _id: deletedSocial?._id,
        }),
        User.deleteOne({
          $and: [
            {
              _id: deletedUser._id,
            },
            {
              email,
            },
          ],
        }),
      ]);

      res.clearCookie('act', { path: '/todo' });
      res.clearCookie('rft', { path: '/todo' });
      res.clearCookie('_csrf', { path: '/todo' });

      return res.status(200).json({
        message: 'Successfully deleted user!',
      });
    } catch (err) {
      return next(err);
    }
  }
}
