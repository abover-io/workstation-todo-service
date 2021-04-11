import { Schema, model, Model } from 'mongoose';

// Typings
import { ISocialDocument } from '@/typings/social';

const SocialSchema: Schema<ISocialDocument> = new Schema(
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

const Social: Model<ISocialDocument> = model<ISocialDocument>('Social', SocialSchema, 'socials');

export default Social;
