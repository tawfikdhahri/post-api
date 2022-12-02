import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, now } from 'mongoose';
// import { Reaction } from 'src/comment/comment.schema';

export type PostDocument = Post & Document;
export class PostReaction {
  likeNumber: number;
  dislikeNumber: number;
}

@Schema()
export class Post {
  @Prop({ required: true })
  text: string;
  @Prop({ required: false })
  image: string;
  @Prop({ default: now() })
  date: Date;
  @Prop({ default: { likeNumber: 0, dislikeNumber: 0 } })
  postReactions: PostReaction;
}

export const PostSchema = SchemaFactory.createForClass(Post);
