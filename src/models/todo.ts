import { Schema, model, Types, Document, Model } from 'mongoose';

const ObjectId = Types.ObjectId;

interface ITodoModel extends Document {
  todoId: any;
  userId: any;
  name: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema({
  userId: {
    type: ObjectId,
    required: [true, 'Todo has to have User ID!']
  },
  name: {
    type: String,
    required: [true, 'Todo name cannot be empty!']
  },
  dueDate: {
    type: Date
  }
});

TodoSchema.pre('save', function (this: ITodoModel, next: any) {
  this.createdAt = new Date();
  next();
});

TodoSchema.pre('update', function (this: ITodoModel, next: any) {
  this.updatedAt = new Date();
  next();
})

const Todo: Model <ITodoModel> = model<ITodoModel>('Todo', TodoSchema);

export default Todo;
