import { Request, Response, NextFunction } from 'express';
import { Types, FilterQuery } from 'mongoose';
import createError from 'http-errors';

// Typings
import {
  ITodoDocument,
  ICreateTodoFormValidations,
  ICreateTodoFormData,
  IUpdateTodoFormValidations,
  IUpdateTodoFormData,
  TodoPriority,
} from '@/types/todo';

// Models
import { Todo } from '@/models';

// Utils
import { TodoValidator } from '@/utils/validator';

export default class TodoController {
  public static async GetAllTodos(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const listId: string | any = req.params.listId || req.query.listId;

      const validation = TodoValidator.ListId(listId);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const conditions: FilterQuery<ITodoDocument> = {
        listId: Types.ObjectId(listId),
      };

      const [todos, total] = await Promise.all([
        Todo.find(conditions),
        Todo.countDocuments(conditions),
      ]);

      return res.status(200).json({
        message: `Successfully fetched all todos!`,
        total,
        todos,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async CreateTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const formData: ICreateTodoFormData = {
        listId: req.params.listId || req.query.listId || req.body.listId,
        name: req.body.name,
        notes: req.body.notes || null,
        url: req.body.url || null,
        isDateSet: req.body.isDateSet || false,
        isTimeSet: req.body.isTimeSet || false,
        due: req.body.due || null,
        priority: req.body.priority || 'none',
      };

      const validations: ICreateTodoFormValidations = {
        listId: TodoValidator.ListId(formData.listId),
        name: TodoValidator.Name(formData.name),
        notes: TodoValidator.Notes(formData.notes),
        url: TodoValidator.URL(formData.url),
        isDateSet: TodoValidator.IsDateSet(formData.isDateSet),
        isTimeSet: TodoValidator.IsTimeSet(formData.isTimeSet),
        due: TodoValidator.Due(formData.due),
        priority: TodoValidator.Priority(formData.priority),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Please correct todo validations!',
          validations,
        });
      }

      const createdTodo: ITodoDocument = await Todo.create({
        listId: formData.listId,
        name: formData.name,
        notes: formData.notes,
        url: formData.url,
        isDateSet: formData.isDateSet,
        isTimeSet: formData.isTimeSet,
        due: formData.due,
        priority: formData.priority,
      });

      return res
        .status(201)
        .json({ message: 'Successfully created todo!', todo: createdTodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async UpdateTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const formData: IUpdateTodoFormData = {
        _id: req.params.todoId || req.query.todoId || req.body._id,
        listId: req.body.listId,
        name: req.body.name,
        notes: req.body.notes || null,
        url: req.body.url || null,
        isDateSet: req.body.isDateSet || false,
        isTimeSet: req.body.isTimeSet || false,
        due: req.body.due || null,
        priority: req.body.priority || 'none',
      };

      const validations: IUpdateTodoFormValidations = {
        _id: TodoValidator.Id(formData._id),
        listId: TodoValidator.ListId(formData.listId),
        name: TodoValidator.Name(formData.name),
        notes: TodoValidator.Notes(formData.notes),
        url: TodoValidator.URL(formData.url),
        isDateSet: TodoValidator.IsDateSet(formData.isDateSet),
        isTimeSet: TodoValidator.IsTimeSet(formData.isTimeSet),
        due: TodoValidator.Due(formData.due),
        priority: TodoValidator.Priority(formData.priority),
      };

      if (!Object.values(validations).every((v) => v.error === false)) {
        throw createError(400, {
          message: 'Please correct todo validations!',
          validations,
        });
      }

      const updatedTodo: ITodoDocument | null = await Todo.findOneAndUpdate(
        {
          _id: Types.ObjectId(formData._id),
        },
        {
          listId: formData.listId,
          name: formData.name,
          notes: formData.notes,
          url: formData.url,
          isDateSet: formData.isDateSet,
          isTimeSet: formData.isTimeSet,
          due: formData.due,
          priority: formData.priority as TodoPriority,
        },
        { new: true },
      );

      if (!updatedTodo) {
        throw createError(404, {
          message: `Todo with ID ${formData._id} is not found!`,
        });
      }

      return res
        .status(200)
        .json({ message: 'Successfully updated todo!', todo: updatedTodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async CompleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any =
        req.params.todoId || req.query.todoId || req.body._id;
      const validation = TodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const completedTodo: ITodoDocument | null = await Todo.findOneAndUpdate(
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

      if (!completedTodo) {
        throw createError(404, `Todo with ID ${_id} is not found!`);
      }

      return res
        .status(200)
        .json({ message: 'Successfully completed todo!', todo: completedTodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async UncompleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any =
        req.params.todoId || req.query.todoId || req.body._id;
      const validation = TodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const uncompletedTodo: ITodoDocument | any = await Todo.findOneAndUpdate(
        {
          _id: Types.ObjectId(_id),
        },
        { completed: false },
        { new: true },
      );

      if (!uncompletedTodo) {
        throw createError(404, `Todo with ID ${_id} is not found!`);
      }

      return res.status(200).json({
        message: 'Successfully uncompleted todo!',
        todo: uncompletedTodo,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async DeleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const _id: string | any = req.params.todoId || req.query.todoId;
      const validation = TodoValidator.Id(_id);

      if (validation.error) {
        throw createError(400, {
          message: validation.text,
        });
      }

      const deletedTodo: ITodoDocument | null = await Todo.findOneAndDelete({
        _id: Types.ObjectId(_id),
      });

      if (!deletedTodo) {
        throw createError(404, `Todo with ID ${_id} is not found!`);
      }

      return res
        .status(200)
        .json({ message: 'Successfully deleted todo!', todo: deletedTodo });
    } catch (err) {
      return next(err);
    }
  }
}
