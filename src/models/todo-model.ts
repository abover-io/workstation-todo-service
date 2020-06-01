import { Schema, model, Model } from 'mongoose';

import { ITodo } from '@/types';

const TodoSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Todo has to have username!']
  },
  name: {
    type: String,
    required: [true, 'Todo name cannot be empty!']
  },
  due: {
    type: Date,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    default: null
  }
});

TodoSchema.pre('save', function (this: ITodo, next: any) {
  this.createdAt = new Date();
  next();
});

TodoSchema.pre('update', function (this: ITodo, next: any) {
  this.updatedAt = new Date();
  next();
})

const Todo: Model <ITodo> = model<ITodo>('Todo', TodoSchema);

export default Todo;
