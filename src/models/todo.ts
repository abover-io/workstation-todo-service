import { Schema, model, Model } from 'mongoose';

import { ITodoDocument } from '@/typings/todo';

const TodoSchema: Schema<ITodoDocument> = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: [true, 'Todo has to have username!'],
    },
    name: {
      type: Schema.Types.String,
      required: [true, 'Todo name cannot be empty!'],
    },
    due: {
      type: Schema.Types.Date,
      default: null,
    },
    isTimeSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    completed: {
      type: Schema.Types.Boolean,
      default: false,
    },
    priority: {
      type: Schema.Types.Number,
      default: 4,
    },
    position: {
      type: Schema.Types.Number,
      default: null,
    },
  },
  { timestamps: true },
);

const Todo: Model<ITodoDocument> = model<ITodoDocument>('Todo', TodoSchema, 'todos');

export default Todo;
