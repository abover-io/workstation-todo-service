import { Schema, model, Model } from 'mongoose';

import { IListDocument } from '@/types/list';

const ListSchema: Schema<IListDocument> = new Schema<IListDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    color: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true },
);

const List: Model<IListDocument> = model<IListDocument>(
  'List',
  ListSchema,
  'lists',
);

export default List;
