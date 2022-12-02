import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, now } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { Post } from 'src/posts/post.schema';

export type CommentDocument = Comment & Document;
export class Reaction {
  likeNumber: number;
  dislikeNumber: number;
}

@Schema()
export class Comment {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author: MongooseSchema.Types.ObjectId;
  @Prop({ required: true })
  text: string;
  @Prop({ default: now() })
  date: Date;
  @Prop({ default: { likeNumber: 0, dislikeNumber: 0 } })
  reaction: Reaction;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Post.name,
    required: true,
  })
  post: MongooseSchema.Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
