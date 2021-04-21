import { Schema, model, Model } from 'mongoose';

import { ITodoDocument } from '@/types/todo';

const TodoSchema: Schema<ITodoDocument> = new Schema<ITodoDocument>(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      default: null,
    },
    url: {
      type: Schema.Types.String,
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
      type: Schema.Types.String,
      default: 'none',
    },
    listId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const Todo: Model<ITodoDocument> = model<ITodoDocument>(
  'Todo',
  TodoSchema,
  'todos',
);

export default Todo;
