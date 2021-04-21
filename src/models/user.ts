import { Schema, model, Model, HookNextFunction } from 'mongoose';
import { hashSync } from 'bcryptjs';

import { IUserDocument } from '@/types/user';

const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    isUsernameSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    username: {
      type: Schema.Types.String,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    isPasswordSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    password: {
      type: Schema.Types.String,
    },
    refreshTokens: [Schema.Types.String],
    apiKey: {
      type: Schema.Types.String,
      required: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    profileImageURL: {
      type: Schema.Types.String,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', function (this: IUserDocument, next: HookNextFunction) {
  if (this.password) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

const User: Model<IUserDocument> = model<IUserDocument>(
  'User',
  UserSchema,
  'users',
);

export default User;
