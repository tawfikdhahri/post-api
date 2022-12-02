import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ReactionType } from 'src/comment/dto/react-comment-request.dto';

import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
  ) {}

  getUserDetails(user: UserDocument): any {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      likedPosts: user.likedPosts,
      dislikedPosts: user.dislikedPosts,
      likedComments: user.likedComments,
      dislikedComments: user.dislikedComments,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<any | null> {
    const user = await this.UserModel.findById(id).exec();
    if (!user) return null;
    return this.getUserDetails(user);
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const newUser = new this.UserModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
  async updateReactionFields(
    user: any,
    type: ReactionType,
    commentId: any,
  ): Promise<any> {
    const query =
      type === ReactionType.like
        ? { $push: { likedComments: commentId } }
        : { $push: { dislikedComments: commentId } };
    return this.UserModel.updateOne({ id: user }, query);
  }
}
