import { Schema, model, Model } from 'mongoose';

import { ITodo } from '@/types';

const TodoSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Todo has to have username!'],
    },
    name: {
      type: String,
      required: [true, 'Todo name cannot be empty!'],
    },
    due: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

const Todo: Model<ITodo> = model<ITodo>('Todo', TodoSchema);

export default Todo;
