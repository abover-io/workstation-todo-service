import { Schema, model, Model } from 'mongoose';

// Typings
import { ISocial } from '@/typings';

const SocialSchema: Schema<ISocial> = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, 'Social name cannot be empty!'],
    },
    socialId: {
      type: Schema.Types.Mixed,
      required: [true, 'Social ID cannot be empty!'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID cannot be empty!'],
    },
  },
  {
    timestamps: true,
  },
);

const Social: Model<ISocial> = model<ISocial>('Social', SocialSchema);

export default Social;
