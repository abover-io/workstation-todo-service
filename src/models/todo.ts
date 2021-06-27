import { Schema, model, Model } from 'mongoose';

// Types
import { ITodoDocument, TodoPriority } from '@/types/todo';

const TodoSchema: Schema<ITodoDocument> = new Schema<ITodoDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    listId: {
      type: Schema.Types.ObjectId,
      default: null,
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
    isDateSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isTimeSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    due: {
      type: Schema.Types.Date,
      default: null,
    },
    completed: {
      type: Schema.Types.Boolean,
      default: false,
    },
    priority: {
      type: Schema.Types.String,
      enum: [
        TodoPriority.NONE,
        TodoPriority.LOW,
        TodoPriority.MEDIUM,
        TodoPriority.HIGH,
      ],
      default: TodoPriority.NONE,
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
