import { Schema, model, Model, HookNextFunction } from 'mongoose';
import { hashSync } from 'bcryptjs';

import { IUserDocument } from '@/types/user';

const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      default: null,
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
