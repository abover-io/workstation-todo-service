import { Types } from 'mongoose';

import Todo from '../models/todo';

const { ObjectId } = Types;

class TodoController {
  static async findAll(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const todos = await Todo.find({
        _id: ObjectId(userId)
      });
      res.status(200).json({ todos });
    } catch (err) {
      next(err);
    }
  }

  static async findOne(req: any, res: any, next: any) {
    try {
      const { userId, todoId } = req.params;
      const todo = await Todo.findOne({
        $and: [
          {
            _id: ObjectId(todoId)
          },
          {
            userId: ObjectId(userId)
          }
        ]
      });
      res.status(200).json({ todo });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const { name, dueDate } = req.body;
      const todo = await Todo.create({
        userId,
        name,
        dueDate
      });
      todo.userId = userId;
      res.status(201).json({ todo, message: 'Successfully created todo!' });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: any, res: any, next: any) {
    try {
      const { userId, todoId } = req.params;
      const { name, dueDate } = req.body;
      const todo = await Todo.findOneAndUpdate(
        {
          $and: [
            {
              _id: ObjectId(todoId)
            },
            {
              userId: ObjectId(userId)
            }
          ]
        },
        {
          name,
          dueDate,
          updatedAt: new Date()
        },
        { new: true }
      );
      res.status(200).json({ todo, message: 'Successfully updated todo!' });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: any, res: any, next: any) {
    try {
      const { userId, todoId } = req.params;
      const todo = await Todo.findOneAndDelete({
        $and: [
          {
            _id: ObjectId(todoId)
          },
          {
            userId: ObjectId(userId)
          }
        ]
      });
      res.status(200).json({ todo, message: 'Successfully deleted todo!' });
    } catch (err) {
      next(err);
    }
  }
}

export default TodoController;
