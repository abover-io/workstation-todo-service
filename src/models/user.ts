import { Schema, model, Document, Model, HookNextFunction } from 'mongoose';
import validator from 'validator';
import { hashSync } from 'bcryptjs';

export interface IUserModel extends Document {
  userId: any;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: Array<String>;
}

const UserSchema: Schema = new Schema({
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
  ]
});

UserSchema.pre('save', function(this: IUserModel, next: HookNextFunction) {
  this.password = hashSync(this.password, 10);
  this.createdAt = new Date();
  next();
});

UserSchema.post('insertOne', function(this: IUserModel) {
  this.userId = this._id;
});

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export default User;
