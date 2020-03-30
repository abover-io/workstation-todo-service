import { compareSync } from 'bcryptjs';
import { Types } from 'mongoose';

import User from '../models/user';
import generateToken from '../helpers/generateToken';

const { ObjectId } = Types;

class UserController {
  static async signUp(req: any, res: any, next: any) {
    try {
      const { firstName, lastName = '', username, email, password } = req.body;
      const newUser = await User.create({
        firstName,
        lastName,
        username,
        email,
        password
      });
      res
        .status(201)
        .json({ user: newUser, message: 'Successfully signed up!' });
    } catch (err) {
      next(err);
    }
  }

  static async signIn(req: any, res: any, next: any) {
    try {
      const { userIdentifier, password } = req.body;
      const signInUser: any = await User.findOne({
        $or: [
          {
            username: userIdentifier
          },
          {
            email: userIdentifier
          }
        ]
      });
      const { _id, firstName, lastName, username, email } = signInUser;
      if (compareSync(password, signInUser.password)) {
        res.status(200).json({
          user: {
            _id,
            firstName,
            lastName,
            username,
            email
          },
          message: `Welcome, ${firstName}`,
          token: generateToken({
            firstName,
            lastName,
            username,
            email
          })
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updatePut(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const { firstName, lastName = '', username, email } = req.body;
      const updatedPutUser = await User.findOneAndUpdate(
        { _id: ObjectId(userId) },
        { firstName, lastName, username, email }
      );
      res
        .status(200)
        .json({ user: updatedPutUser, message: 'Successfully updated user!' });
    } catch (err) {
      next(err);
    }
  }

  static async updatePatch(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const { password } = req.body;
      const updatedPatchUser = await User.findOneAndUpdate(
        { _id: ObjectId(userId) },
        { password }
      );
      res.status(200).json({
        user: updatedPatchUser,
        message: 'Successfully updated user password!'
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: any, res: any, next: any) {
    try {
      const { userId } = req.params;
      const deletedUser = await User.findOneAndDelete({
        _id: ObjectId(userId)
      });
      res.status(200).json({
        user: deletedUser,
        message: 'Successfully deleted user account!'
      });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
