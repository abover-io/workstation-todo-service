import { Schema, model, Model } from 'mongoose';

import { ISubtodoDocument } from '@/types/subtodo';

const SubtodoSchema: Schema<ISubtodoDocument> = new Schema<ISubtodoDocument>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    todoId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const Subtodo: Model<ISubtodoDocument> = model<ISubtodoDocument>(
  'Subtodo',
  SubtodoSchema,
  'subtodos',
);

export default Subtodo;
