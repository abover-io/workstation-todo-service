import { Document, Types } from 'mongoose';

export interface ISocialDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  socialId: string | number | Types.ObjectId;
  userId: Types.ObjectId;
}
