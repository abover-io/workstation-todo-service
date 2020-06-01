import { Schema, model, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import { hashSync } from 'bcryptjs';
import { sign as JwtSign } from 'jsonwebtoken';

import { IUser } from '@/types';
import { JWT_API_KEY_SECRET } from '@/config';

const UserSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name cannot be empty!']
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    required: [true, 'Username cannot be empty!'],
    unique: [true, 'Username is not available.']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty!'],
    unique: [true, 'Email is not available.'],
    validate: [validator.isEmail, 'Invalid email address!']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty!'],
    minlength: [6, 'Minimum length is 6 characters!']
  },
  refreshTokens: [
    {
      type: String
    }
  ],
  apiKey: {
    type: String,
    required: [true, 'API Key cannot be empty!']
  }
});

UserSchema.pre('save', function (this: IUser, next: HookNextFunction) {
  const { username, email } = this;
  this.password = hashSync(this.password, 10);
  this.apiKey = JwtSign({ username, email }, JWT_API_KEY_SECRET);
  this.createdAt = new Date();
  next();
});

UserSchema.post('insertOne', function(this: IUser) {
  this.userId = this._id;
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
