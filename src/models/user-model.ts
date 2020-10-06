import { Schema, model, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import { hashSync } from 'bcryptjs';

import { IUser } from '@/typings';

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name cannot be empty!'],
    },
    lastName: {
      type: String,
    },
    isUsernameSet: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      // required: [true, 'Username cannot be empty!'],
      unique: [true, 'Username is not available.'],
      minlength: [6, 'Username must be at least 6 characters!']
    },
    email: {
      type: String,
      required: [true, 'Email cannot be empty!'],
      unique: [true, 'Email is not available.'],
      validate: [validator.isEmail, 'Invalid email address!'],
    },
    isPasswordSet: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      // required: [true, 'Password cannot be empty!'],
      minlength: [6, 'Password must be at least 6 characters!'],
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
    apiKey: {
      type: String,
      required: [true, 'API Key cannot be empty!'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImageURL: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', function (this: IUser, next: HookNextFunction) {
  if (this.password) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
