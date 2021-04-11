import { Schema, model, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import { hashSync } from 'bcryptjs';

import { IUserDocument } from '@/typings/user';

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
      required: [true, 'First name cannot be empty!'],
    },
    lastName: {
      type: Schema.Types.String,
    },
    isUsernameSet: {
      type: Schema.Types.Boolean,
      default: false
    },
    username: {
      type: Schema.Types.String,
      // required: [true, 'Username cannot be empty!'],
      unique: [true, 'Username is not available.'],
      minlength: [6, 'Username must be at least 6 characters!']
    },
    email: {
      type: Schema.Types.String,
      required: [true, 'Email cannot be empty!'],
      unique: [true, 'Email is not available.'],
      validate: [validator.isEmail, 'Invalid email address!'],
    },
    isPasswordSet: {
      type: Schema.Types.Boolean,
      default: false,
    },
    password: {
      type: Schema.Types.String,
      // required: [true, 'Password cannot be empty!'],
      minlength: [6, 'Password must be at least 6 characters!'],
    },
    refreshTokens: [Schema.Types.String],
    apiKey: {
      type: Schema.Types.String,
      required: [true, 'API Key cannot be empty!'],
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

const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema, 'users');

export default User;
