import { Request, Response, NextFunction } from 'express';
import { Types, QueryOptions, FilterQuery } from 'mongoose';
import createError from 'http-errors';

// Types
import {
  ISubtodoDocument,
  ISubtodo,
  IAddSubtodoFormValidations,
  IAddSubtodoFormData,
  IUpdateSubtodoFormValidations,
  IUpdateSubtodoFormData,
} from '@/types/subtodo';

// Models
import { Subtodo } from '@/models';

// Utils
import { SubtodoValidator } from '@/utils/validator';

export default class SubtodoController {
  public static async GetAllSubtodos(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const options: QueryOptions = {
        limit: 100,
        skip: 0,
        sort: {
          _id: 1,
        },
      };

      const todoId: string | any = req.params.todoId || req.query.todoId;
      const validation = SubtodoValidator.TodoId(todoId);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const conditions: FilterQuery<
        Pick<ISubtodoDocument, keyof ISubtodoDocument>
      > = {
        todoId: Types.ObjectId(todoId),
      };

      const [subtodos, total] = await Promise.all([
        Subtodo.find(conditions, null, options),
        Subtodo.countDocuments(conditions),
      ]);

      return res.status(200).json({
        total,
        subtodos,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async AddSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const formData: IAddSubtodoFormData = {
        name: req.body.name,
        todoId: req.body.todoId,
      };

      const validations: IAddSubtodoFormValidations = {
        name: SubtodoValidator.Name(formData.name),
        todoId: SubtodoValidator.TodoId(formData.todoId),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Please correct subtodo validations!',
          validations,
        });
      }

      const createdSubtodo: ISubtodoDocument = await Subtodo.create({
        name: formData.name,
        todoId: Types.ObjectId(formData.todoId),
      });

      return res.status(201).json({ subtodo: createdSubtodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async UpdateSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const formData: IUpdateSubtodoFormData = {
        _id: req.params.subtodoId || req.query.subtodoId || req.body._id,
        name: req.body.name,
        todoId: req.body.todoId,
      };

      const validations: IUpdateSubtodoFormValidations = {
        _id: SubtodoValidator.Id(formData._id),
        name: SubtodoValidator.Name(formData.name),
        todoId: SubtodoValidator.TodoId(formData.todoId),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Plese correct subtodo validations!',
          validations,
        });
      }

      const updatedSubtodo: ISubtodoDocument | null =
        await Subtodo.findOneAndUpdate(
          {
            _id: Types.ObjectId(formData._id),
          },
          {
            name: formData.name,
            todoId: Types.ObjectId(formData.todoId),
          },
          { new: true },
        );

      if (!updatedSubtodo) {
        throw createError(404, `Subtodo with ID ${formData._id} is not found!`);
      }

      return res.status(200).json({ subtodo: updatedSubtodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async CompleteSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any =
        req.params.subtodoId || req.query.subtodoId || req.body._id;
      const validation = SubtodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const completedSubtodo: ISubtodoDocument | null =
        await Subtodo.findOneAndUpdate(
          {
            _id: Types.ObjectId(_id),
          },
          {
            completed: true,
          },
          {
            new: true,
          },
        );

      if (!completedSubtodo) {
        throw createError(404, `Subtodo with ID ${_id} is not found!`);
      }

      return res.status(200).json({
        message: 'Successfully completed subtodo!',
        subtodo: completedSubtodo,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async UncompleteSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any =
        req.params.subtodoId || req.query.subtodoId || req.body._id;
      const validation = SubtodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const uncompletedSubtodo: ISubtodoDocument | null =
        await Subtodo.findOneAndUpdate(
          {
            _id: Types.ObjectId(_id),
          },
          { completed: false },
          { new: true },
        );

      if (!uncompletedSubtodo) {
        throw createError(404, `Subtodo with ID ${_id} is not found!`);
      }

      return res.status(200).json({
        message: 'Successfully uncompleted subtodo!',
        subtodo: uncompletedSubtodo,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async DeleteSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any = req.params.subtodoId || req.query.subtodoId;
      const validation = SubtodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const deletedSubtodo: ISubtodoDocument | null =
        await Subtodo.findOneAndDelete({
          _id: Types.ObjectId(_id),
        });

      if (!deletedSubtodo) {
        throw createError(404, `Subtodo with ID ${_id} is not found!`);
      }

      return res.status(200).json({
        message: 'Successfully deleted subtodo!',
        subtodo: deletedSubtodo,
      });
    } catch (err) {
      return next(err);
    }
  }
}
