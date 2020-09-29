import { Schema, model, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import { hashSync } from 'bcryptjs';

import { IUser } from '@/types';

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name cannot be empty!'],
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: [true, 'Username cannot be empty!'],
      unique: [true, 'Username is not available.'],
    },
    email: {
      type: String,
      required: [true, 'Email cannot be empty!'],
      unique: [true, 'Email is not available.'],
      validate: [validator.isEmail, 'Invalid email address!'],
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty!'],
      minlength: [6, 'Minimum length is 6 characters!'],
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
      required: [true, 'Verification status cannot be empty!'],
      default: false,
    },
    profileImageURL: {
      type: String,
      required: [true, 'Profile Image URL cannot be empty!'],
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', function (this: IUser, next: HookNextFunction) {
  this.password = hashSync(this.password, 10);
  next();
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
